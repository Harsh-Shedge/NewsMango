import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: this.articles,
      loading: true,
      page: 1,
      totalResults: 0,
    };
    document.title = `NewsMango - ${this.props.category[0].toUpperCase()}${this.props.category.slice(
      1
    )}`;

    this.updateNews = this.updateNews.bind(this);
  }

  async updateNews(props) {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&pageSize=${this.props.pageSize}&category=${this.props.category}&apiKey=3d92060348674561b32ddd6837e8fd5e&page=${this.state.page}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(40);
    let parsedData = await data.json();
    this.props.setProgress(60);

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&pageSize=${this.props.pageSize}&category=${this.props.category}&apiKey=3d92060348674561b32ddd6837e8fd5e&page=${this.state.page}`;

    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "60px 0px" }}>
          NewsMango - Top Headlines from {this.props.category[0].toUpperCase()}
          {this.props.category.slice(1)}
        </h1>
        {this.state.loading && <Spinner />}
        {this.state.articles && (
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner />}
          >
            <div className="container">
              <div className="row">
                {this.state.articles &&
                  this.state.articles.map((element) => {
                    return (
                      <div
                        className="col-md-4"
                        key={`${element.url}+${element}`}
                      >
                        <NewsItem
                          source={element.source.name}
                          author={element.author}
                          date={element.publishedAt}
                          title={
                            element.title ? element.title.slice(0, 45) : ""
                          }
                          description={
                            element.description
                              ? element.description.slice(0, 88)
                              : ""
                          }
                          imageUrl={element.urlToImage}
                          newsUrl={element.url}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </InfiniteScroll>
        )}
      </>
    );
  }
}

export default News;
