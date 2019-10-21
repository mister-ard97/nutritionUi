import React, { Component } from 'react';
import Axios from 'axios';
import { Modal } from 'reactstrap';
import {URL_API} from './supports/URL';
import numeral from 'numeral'

class App extends Component {

  state = {
    editSelected: null,
    loading: false, 
    loadingData: false,
    data : [],

    openModal: false,
  }

  componentDidMount() {
    document.title = 'Nutrition Calculation';

    Axios.get(URL_API + '/item/getItem')
    .then((res) => {
      this.setState({
        data: res.data
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  renderDataNutrisi = () => {
    if(this.state.data.length !== 0) {
      let jsx = this.state.data.map((val, index) => {
        if(this.state.editSelected === val.id) {
         return (
           <tr key={index}>
             <td>{val.material}</td>
             <td>
               <input ref={(beratBuah) => this.beratBuah = beratBuah} type='number' placeholder='Masukkan berat buah' />
             </td>
             <td>{val.calorie}</td>
             <td>{parseFloat(val.protein * 100).toFixed(2)}</td>
           <td>{parseFloat(val.totalFat * 100).toFixed(2)}</td>
           <td>{parseFloat(val.saturated * 100).toFixed(2)}</td>
           <td>{parseFloat(val.mufa * 100).toFixed(2)}</td>
           <td>{parseFloat(val.pufa * 100).toFixed(2)}</td>
           <td>{parseFloat(val.carbohydrat * 100).toFixed(2)}</td>
           <td>{parseFloat(val.fiber * 100).toFixed(2)}</td>
             <td>Rp. {val.price}</td>
             <td>
               <a href={`${val.source_url}`} target='_blank' rel='noopener noreferrer'>
                 Detail Buah
               </a>  
             </td>
             <td>
               <input type='button' className='btn btn-success' value='Save' onClick={() => this.EditDataBuah()}/> 
             </td>
             <td>
             <input type='button' className='btn btn-danger' value='Cancel' onClick={() => this.setState({editSelected: null})}/> 
             </td>
           </tr>
         )
        } 
        
        return (
         <tr key={index}>
           <td>{val.material} </td>
           <td>100 gram</td>
           <td>{val.calorie}</td>
           <td>{parseFloat(val.protein * 100).toFixed(2)}</td>
           <td>{parseFloat(val.totalFat * 100).toFixed(2)}</td>
           <td>{parseFloat(val.saturated * 100).toFixed(2)}</td>
           <td>{parseFloat(val.mufa * 100).toFixed(2)}</td>
           <td>{parseFloat(val.pufa * 100).toFixed(2)}</td>
           <td>{parseFloat(val.carbohydrat * 100).toFixed(2)}</td>
           <td>{parseFloat(val.fiber * 100).toFixed(2)}</td>
           <td>Rp. {numeral(val.price * 100).format(0, 0)}</td>
           <td>
               <a href={`${val.source_url}`} target='_blank' rel='noopener noreferrer'>
                 Detail Buah
               </a>  
             </td>
           <td>
             <input type='button' className='btn btn-success' value='Ubah Berat Buah' onClick={() => this.setState({editSelected: val.id})}/> 
           </td>
           <td>
           <input type='button' className='btn btn-danger' value='Hapus Buah' onClick={() => this.setState({editSelected: val.id})}/> 
           </td>
         </tr>
       )
   
       })
   
       return jsx;
    }
    
  }

  toggle = () => {
    this.setState({
      openModal: !this.state.openModal
    })
  }


  render() {
    return (
      <div>
          <div className='bg-light'>
            <div className='container'>
              <div className='row m-0'>
                <div className='col-12 py-5'>
                    <h4>Nutrition Calculation</h4>
                </div>
              </div>
            </div>
          </div>

            <div className='container'>
              <div className='col-12'>
                <input type='button' className='btn btn-secondary form-control mb-3' value='Add New Recipe' onClick={() => this.setState({ openModal: true})}/>

                <input type='text' className='form-control' placeholder='Search Recipe' />
              </div>
            </div>

              <table class="table mt-5">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">Material Name</th>
                        <th scope="col">Weight (gram)</th>
                        <th scope="col">Calorie (kcal)</th>
                        <th scope="col">Protein</th>
                        <th scope="col">Total Fat</th>
                        <th scope="col">Saturated</th>
                        <th scope="col">MUFA</th>
                        <th scope="col">PUFA</th>
                        <th scope="col">Carbohydrate</th>
                        <th scope="col">Fiber</th>
                        <th scope="col">Price</th>
                        <th scope="col">Source</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderDataNutrisi()}
                    </tbody>
                  </table>

      </div>
    )
  }
}

export default App;

