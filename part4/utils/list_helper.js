const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (!Array.isArray(blogs)) {
        blogs = []
    }
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((prev, current) => {
        return (current.likes > prev.likes) ? current : prev
    })
}

//Return author with most written blogs as well as that number of blogs
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorMap = new Map()
    blogs.forEach(blog => {
        authorMap.set(blog.author, (authorMap.get(blog.author) || 0) + 1)
    })
    const maxBlog = [...authorMap.entries()].reduce((max, current) => {
        return current[1] > max[1] ? current : max
    })
    return { author: maxBlog[0], blogs: maxBlog[1] }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorMap = new Map()
    blogs.forEach(blog => {
        authorMap.set(blog.author, (authorMap.get(blog.author) || 0) + blog.likes)
    })
    const mostLiked = [...authorMap.entries()].reduce((max, current) => {
        return current[1] > max[1] ? current : max
    })
    return { author: mostLiked[0], likes: mostLiked[1] }
}

  
module.exports = {
    dummy,
    totalLikes, 
    favoriteBlog,
    mostLikes,
    mostBlogs
}