import Post from '../models/post.model.js';

export const createPost = async (postData) => {
    const post = new Post(postData);
    return await post.save();
};

export const getAllPosts = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const posts = await Post.find({ isDeleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalPosts = await Post.countDocuments({ isDeleted: false });
    return {
        posts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
    };
};

export const getPostById = async (id) => {
    const post = await Post.findOne({ _id: id, isDeleted: false });
    return post;
};

export const updatePostById = async (id, updateData) => {
    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });
    return post;
};

export const softDeletePostById = async (id) => {
    const post = await Post.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return post;
};