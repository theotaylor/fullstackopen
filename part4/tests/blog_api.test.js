const {describe, test, beforeEach, after} = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogs = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('testing blog api get', () => {
    test('all blogs returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique identifier is id, not _id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body

        // Check each blog to ensure it has 'id' and does not have '_id'
        blogs.forEach(blog => {
            assert.ok(blog.id, 'ID should be present')
            assert.strictEqual(blog._id, undefined, '_id should be removed')
            assert.strictEqual(blog.__v, undefined, '__v should be removed')
        })
    })
})

   
describe('testing blog api post', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Marley\'s thesis',
            author: 'Marley Schmidt',
            url: 'marleysite.com',
            likes: 8,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        assert.ok(titles.includes("Marley's thesis"), "New blog title should be present")
    })

    test('missing likes property will default to 0', async () => {
        const newBlog = {
            title: 'Theo\'s Adventures',
            author: 'Billy Lee',
            url: 'www.www.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        
        const likesOfLast = blogsAtEnd[blogsAtEnd.length - 1].likes
        assert.strictEqual(likesOfLast, 0)
    })

    //Write tests related to creating new blogs via the /api/blogs endpoint, 
    //that verify that if the title or url properties are missing from the request data, 
    //the backend responds to the request with the status code 400 Bad Request.
    //Make the required changes to the code so that it passes the test.
    test('missing title return', async () => {
        const noTitleBlog = {
            author: 'Joe',
            url: 'sdfasdfasdf.url',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(noTitleBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('missing url return', async () => {
        const noUrlBlog = {
            title: 'Holy Moly',
            author: 'Joe',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(noUrlBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

describe('testing blog api delete', () => {
    test('valid id delete', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[0]

        await api   
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsIn = await helper.blogsInDb()
        assert.strictEqual(helper.initialBlogs.length-1, blogsIn.length)

        const titles = blogsIn.map(b => b.title)
        assert(!titles.includes(blogToDelete.title))
    })
})

describe('testing blog updates', () => {
    test('valid id udpate', async () => {
        const updatedBlog = {
            title: 'Updated Title',
            author: 'Updated Author',
            url: 'updatedsite.com',
            likes: 10
        }

        const blogs = await helper.blogsInDb()
        const blogToUpdate = blogs[0]

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await helper.blogsInDb()
        const updatedBlogInDB = blogsAfter.find(b => b.id === blogToUpdate.id)

        assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
        assert.strictEqual(updatedBlogInDB.title, updatedBlog.title)
        assert.strictEqual(updatedBlogInDB.author, updatedBlog.author)
        assert.strictEqual(updatedBlogInDB.url, updatedBlog.url)
        assert.strictEqual(updatedBlogInDB.likes, updatedBlog.likes)
        
    })
})

after(async () => {
    await mongoose.connection.close()
})


