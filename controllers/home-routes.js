const router = require('express').Router();
const { Post, User, Comment } = require('../models')

router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at',
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ],
    })
    .then(dbPostData => {
        //this  will loop over and map each Sequelize object into a serialized version of itself, saving the results in a new posts array
        const posts = dbPostData.map(post => post.get({ plain: true }))

        res.render('homepage', { 
            posts,
            loggedIn: req.session.loggedIn 
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [
            {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
            },
            {
            model: User,
            attributes: ['username']
            }
        ], 
        order: [[Comment, 'created_at', 'DESC']],
    })
    .then(dbPostData => {
        if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
        }

        // serialize the data
        const post = dbPostData.get({ plain: true });
        console.log(post)

        // pass data to template
        res.render('single-post', { 
            post,
            loggedIn: req.session.loggedIn });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login')
})

module.exports = router;