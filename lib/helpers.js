import User from '../models/User';

export const buildAncestors = async (id, parentId) => {
  try {
    const parent_category = await User.findOne(
      { _id: parentId },
      { name: 1, slug: 1, ancestors: 1 },
    ).exec();

    if (parent_category) {
      const { _id, name, slug, email, role, isAdmin } = parent_category;
      const ancest = [...parent_category.ancestors];
      ancest.unshift({ _id, name, slug, email, role, isAdmin });
      await User.findByIdAndUpdate(id, {
        $set: { ancestors: ancest },
      });
    }
  } catch (err) {
    console.error(err.message);
  }
};

export const buildHierarchyAncestors = async (userId, parentId) => {
  if (userId && parentId) {
    await buildAncestors(userId, parentId);
    const result = await User.find({ parent: userId });
    if (result) {
      result.forEach(async doc => {
        await buildHierarchyAncestors(doc._id, userId);
      });
    }
  }
};

export function slugify(string) {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
