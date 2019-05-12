import React, { Component } from 'react';
import PageTop from '../utils/page_top';

import ProdNfo from './ProductInfo';

import { connect } from 'react-redux';
import { getProductDetail, clearProductDetail } from '../../actions/product_action';



class ProductPage extends Component {

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.dispatch(getProductDetail(id))    
  }

  componentWillMount() {
    this.props.dispatch(clearProductDetail());
  }

  render() {
    return (
      <div>
        <PageTop title="Product Detail" />
        <div className="container">
          {
            this.props.products.prodDetail ?
              <div className="product_detail_wrapper">
                <div className="left">
                  Left
                </div>

                <div className="right">
                  <ProdNfo 
                    addCart={(id) => this.addToCartHandler(id)}
                    detail={this.props.products.prodDetail}
                  />
                </div>
              </div>
              : "Loading"
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  }
}

export default connect(mapStateToProps)(ProductPage);
