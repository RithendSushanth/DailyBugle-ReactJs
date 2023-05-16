import React, {useEffect, useState} from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

// Changed class based components to functional based comps. using hooks
// hooks are used when we want to use classbased components in functional components.
//  like using useEffect instead of componentDidMount(react lifecycle methods). 
 
const News = (props)=>{
    // using useState
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async ()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - DailyBugle`;
        updateNews(); 
        // eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {   
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1) 
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>DailyBugle - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                > 
                    <div className="container">
                         
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>
            </>
        )
    
}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News


// MyCode:-
// import React, { Component } from 'react'
// import NewsItem from './NewsItem'
// import Spinner from './Spinner';

// export class News extends Component {

//     constructor() {
//         super();
//         console.log("Hello i am from constructor from News Component");
//         this.state = {
//             articles: [],
//             loading: false,
//             page: 1
//         }
//     }

//     async componentDidMount() {
//         let url = `https://newsapi.org/v2/everything?q=tesla&from=2023-03-22&sortBy=publishedAt&apiKey=9c577dc9b97a42f3870b833b81bafafc&pageSize=${this.props.pageSize}`;
//         let data = await fetch(url);
//         let parsedData = await data.json()
//         console.log(parsedData);
//         this.setState({ articles: parsedData.articles, totalResults:parsedData.totalResults }) 
//     }

//     handleNextClick = async ()=>{
//         if(!this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)){
//             let url = `https://newsapi.org/v2/everything?q=tesla&from=2023-03-22&sortBy=publishedAt&apiKey=9c577dc9b97a42f3870b833b81bafafc${this.state.page + 1}&pageSize=${this.props.pageSize}`;
//             this.setState({loading:true});
//             let data = await fetch(url);
//             let parsedData = await data.json()
//             console.log(parsedData); 
//             this.setState({
//                 page: this.state.page + 1,
//                 articles: parsedData.articles,
//                 loading : false
//             })  
//         }
//     }

//     handlePrevClick = async ()=>{
//         let url = `https://newsapi.org/v2/everything?q=tesla&from=2023-03-22&sortBy=publishedAt&apiKey=9c577dc9b97a42f3870b833b81bafafc${this.state.page - 1}&pageSize=${this.props.pageSize}`;
//         this.setState({loading:true});
//         let data = await fetch(url);
//         let parsedData = await data.json()
//         console.log(parsedData);
//         this.setState({
//             page: this.state.page - 1,
//             articles: parsedData.articles,
//             loading : false
//         })
//     }
//     // 9c577dc9b97a42f3870b833b81bafafc

//     render() {
//         return (
//             <div className="container my-3">
//                 <h1 className="text-center">NewsMonkey - Top Headlines</h1>
//                 {this.state.loading && <Spinner/>}
//                 {/* <h1>NewsMonkey - Top Headlines</h1> */}
//                 <div className="row">
//                         {this.state.articles.map((element) => {
//                             return <div className="col-md-4" key={element.url}>
//                                 <NewsItem title={element.title ? element.title : ""} 
//                                 description={element.description ? element.description : ""} 
//                                 imageUrl={element.urlToImage} newsUrl={element.url} 
//                                 author={element.author} 
//                                 date={element.publishedAt} 
//                                 source={element.source.name} />
//                             </div>
//                         })}

//                 </div>
//                 <div className="container d-flex justify-content-between">
//                     <button disabled={this.state.page <=1 } type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
//                     <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick} >Next &rarr;</button>
//                 </div>
//             </div>
//         )
//     }
// }

// export default News


                                        