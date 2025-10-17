const synonyms = ["enthusiastic", "eager", "keen", "ardent", "fervent"];

const createElement =(arr)=>{
    const htmlElements = arr.map(item => `<span class="btn">${item}</span>`).join('');
    console.log(htmlElements);
}