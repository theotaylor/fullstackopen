const { test, describe } = require('node:test')
const assert = require('node:assert')

const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = totalLikes({})
        assert.strictEqual(result, 0)
    })

    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]
    
    test('when list has only one blog, equals the likes of that', () => {
        const result = totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    const listOfBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f7',
            title: 'booktitle',
            author: 'jomama',
            url: 'homes.pdf',
            likes: 5,
            __v: 0
        }
    ]

    test('of a bigger list is calculated right', () => {
        const result = totalLikes(listOfBlogs)
        assert.strictEqual(result, 10)
    })
})
