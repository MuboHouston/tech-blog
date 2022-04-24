const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {

    Post.findAll({
        order: [['created_at', 'DESC']],
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id', 
                    'comment_text', 
                    'post_id', 
                    'user_id', 
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: [
                        'username'
                    ]
                }
            },
            {
                model: User,
                attributes: [
                    'username'
                ]
            }
        ]
    })
    .then(dbPostData => {
        // serialize data before passing to template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', (req, res) => {
    
    Post.findByPk( req.params.id, {
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
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            },
        ],
        order: [[Comment, 'created_at', 'DESC']],
    })
    .then(dbPostData => {
        if(dbPostData) {
            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to template
            res.render('edit-post', {
                post,
                loggedIn: true
            })
        } else {
            res.status(404).end();
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports = router;