const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// get all posts
router.get('/', (req, res) => {
    console.log('======================');
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
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            //include JOIN the Post to the User table. This is an array of objects for the event that more than one table JOIN is needed.
            {
                model: User,
                attributes: [
                    'username'
                ]
            },
        ],
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err)
    })
});

//gets post by id
router.get('/:id', (req, res) => {
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
            attributes: ['username']
        }
    ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//create a post
router.post('/', (req, res) => {
      Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//update a post title
router.put('/:id', (req, res) => {
    Post.update(
        {
            post_content: req.body.post_content
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

//delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' })
            return;
        }
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

module.exports = router;