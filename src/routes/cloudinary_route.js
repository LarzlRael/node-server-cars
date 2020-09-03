const { Router } = require('express');
const router = Router();

// rutas Get
router.get('/cloud', (req, res) => {
    res.send('hola desde el cloud');
})

// rutas Post 
// TODO : entrar a la fase de grabado pero son un archvio  por el momento
router.post('/new-Entry', (req, res) => {
    console.log(req.body);
    const { title, author, image, description } = req.body;
    let newBook = {
        id: uuid(),
        title,
        author,
        image,
        description
    }
    if (!title || !author || !image || !description) {
        res.status(404).send('error entradas vacias');
    }
    books.push(newBook);
    //estas 2 lienas escriben 
    const jsonBooks = JSON.stringify(books);
    fs.writeFileSync('src/book.json', jsonBooks, 'utf-8');
    res.redirect('/')

})

module.exports = router;