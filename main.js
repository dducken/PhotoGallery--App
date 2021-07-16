class PhotoGallery {
    constructor() {
        this.API_KEY = '563492ad6f917000010000017a44910f76584ed485df43e32546e408';
        this.galleryDIv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load-more');
        this.logo = document.querySelector('.logo');
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    eventHandle(){
        document.addEventListener('DOMContentLoaded', ()=>{
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e)=>{
            this.pageIndex = 1;
            this.getSearchedImages(e);
        });
        this.loadMore.addEventListener('click', (e)=> {
            this.loadMoreImages(e);
        });
        this.logo.addEventListener('click', ()=>{
            this.pageIndex = 1;
            this.galleryDIv.innerHTML = '';
            this.getImg(this.pageIndex);
        })
    }
    //imagenes menu
    async getImg(index) {
        this.loadMore.setAttribute('data-img','curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        console.log(data);
    }
    async fetchImages(baseURL) {
        const response = await fetch(baseURL,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        return data;
    }
    //forma en la que se muestran las imagenes
    GenerateHTML(photos) {
        photos.forEach(photo=>{
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
            
            <a href='${photo.src.original}' target= "_blank">
            <img class="grid-item" src= "${photo.src.medium}">
            <h3>${photo.photographer}</h3>
            </a>
            
            `;
            this.galleryDIv.appendChild(item)
        });
    }
    //obtener imagenes
    async getSearchedImages(e) {
        this.loadMore.setAttribute('data-img','search');
        e.preventDefault();
        this.galleryDIv.innerHTML= '';
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchedImages(index) {
        const baseURL =  `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
        const data = await this.fetchImages(baseURL);
        console.log(data)
        this.GenerateHTML(data.photos);
    }
    //boton cargar más imagenes
    loadMoreImages(e) {
        let index = ++this.pageIndex; 
        const loadMoreData = e.target.getAttribute('data-img');
        if (loadMoreData === 'curated') {
            //load page 2 for curated
            this.getImg(index);
        }else {
            //load page 2 for search
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new PhotoGallery;



