const { ProjectCategory, Skill } = require('../models');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.categories = asyncHandler(async (req, res) => success(res, 'OK', await ProjectCategory.findAll({ order: [['name', 'ASC']] })));
exports.skills = asyncHandler(async (req, res) => success(res, 'OK', await Skill.findAll({ order: [['name', 'ASC']] })));
