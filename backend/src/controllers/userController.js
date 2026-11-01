const { User } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { userDto } = require('../utils/serializers');
const { deleteAvatarFile } = require('../middleware/upload');

exports.me = asyncHandler(async (req, res) => success(res, 'OK', userDto(req.user)));

exports.uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return error(res, 'No photo file provided. Please select an image file (JPG, PNG, WEBP, GIF).', 400);
  }

  // Delete previous custom uploaded photo if it exists
  if (req.user.profilePhotoUrl) {
    deleteAvatarFile(req.user.profilePhotoUrl);
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  req.user.profilePhotoUrl = avatarUrl;
  await req.user.save();

  return success(res, 'Profile photo updated successfully', {
    profilePhotoUrl: avatarUrl,
    user: userDto(req.user),
  });
});

exports.removePhoto = asyncHandler(async (req, res) => {
  if (req.user.profilePhotoUrl) {
    deleteAvatarFile(req.user.profilePhotoUrl);
    req.user.profilePhotoUrl = null;
    await req.user.save();
  }

  return success(res, 'Profile photo removed', {
    profilePhotoUrl: null,
    user: userDto(req.user),
  });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const { fullName, phone, profilePhotoUrl } = req.body;

  if (fullName !== undefined) {
    const trimmed = String(fullName).trim();
    if (!trimmed) return error(res, 'Full name cannot be blank', 400);
    req.user.fullName = trimmed;
  }

  if (phone !== undefined) {
    req.user.phone = phone ? String(phone).trim() : null;
  }

  if (profilePhotoUrl !== undefined) {
    // If user changes to a preset or removes photo, clean up old disk file if it was locally uploaded
    if (req.user.profilePhotoUrl && req.user.profilePhotoUrl !== profilePhotoUrl) {
      deleteAvatarFile(req.user.profilePhotoUrl);
    }
    req.user.profilePhotoUrl = profilePhotoUrl ? String(profilePhotoUrl).trim() : null;
  }

  await req.user.save();
  return success(res, 'Profile updated successfully', userDto(req.user));
});

exports.getById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return error(res, 'User not found', 404);
  // Public view: no phone/email exposure beyond what the profile pages need
  return success(res, 'OK', { id: user.id, fullName: user.fullName, role: user.role, profilePhotoUrl: user.profilePhotoUrl });
});

