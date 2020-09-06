const cars_cards = document.querySelector('#cars_cards');



async function getCards() {
    let url = 'http://localhost:3000/getImages'
    let response = await fetch(url);
    let data = await response.json()


    console.log(data)

    data.forEach(element => {
        const img = document.createElement('img');
        img.style.width = '200px';
        img.style.height = '350px';
        
        img.style.margin = '20px'
        console.log(element.imageURL)
        img.src = element.imageURL;
        cars_cards.appendChild(img);
    });

}



async function main() {
    await getCards();
}

main();