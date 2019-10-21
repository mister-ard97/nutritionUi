import React, { Component } from 'react';
import Axios from 'axios';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

import {URL_API} from './supports/URL';
import numeral from 'numeral'

class App extends Component {

  state = {
    idAddRecipe: 1,
    jumlahBuah: 0,
    materialChoosed: null,
    detailSelected: null,
    loading: false, 
    loadingData: false,
    data : [],
    renderulang : false,

    openModal: false,
  }

  componentDidMount() {
    document.title = 'Nutrition Calculation';

    Axios.get(URL_API + '/item/getItem')
    .then((res) => {
      this.setState({
        dataAwal: res.data,

      })
      console.log(this.state.dataAwal)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  renderAddRecipe = () => {
    return (
      <Modal isOpen={this.state.openModal} toggle={this.toggle} style={{maxWidth : '1366px'}}>
        <ModalHeader toggle={this.toggle}>Nutrition Calculation</ModalHeader>
        <ModalBody>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <input type='text' className='form-control' placeholder='Masukkan Nama Recipe' ref={(NamaRecipe) => this.NamaRecipe = NamaRecipe}/>
            </div>
            <div className='col-12'>
              <Button className='btn btn-secondary' onClick={() => this.setState({jumlahBuah: this.state.jumlahBuah + 1})}>
                Tambah Bahan
              </Button>
            </div>
          </div>
        </div>

        <table class="table mt-5">
          <thead class="thead-dark">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Material Name</th>
              <th scope="col">Weight (gram)</th>
              <th scope="col">Calorie</th>
              <th scope="col">Protein</th>
              <th scope="col">TotalFat</th>
              <th scope="col">Saturated</th>
              <th scope="col">MUFA</th>
              <th scope="col">PUFA</th>
              <th scope="col">Carbo</th>
              <th scope="col">Fiber</th>
              <th scope="col">Price</th>

            </tr>
          </thead>
          <tbody>
            {this.renderJumlahBuah()}

          </tbody>
          <tfoot>
            {this.renderTotal()}
          </tfoot>
        </table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.saveRecipe}>Save</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }

  // <td>{`${parseFloat(data.calorie).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.protein).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.totalFat).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.saturated).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.mufa).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.pufa).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.carbohydrat).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.fiber).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.price).toFixed(2)}`}</td>

  renderTotal = () =>{
    if(this.state.jumlahBuah > 0 ){
      var totalweight = 0
      var totalcalorie = 0
      var totalprotein = 0
      var totalFat = 0
      var totalsaturated = 0
      var totalmufa = 0
      var totalpufa = 0
      var totalcarbohydrat = 0
      var totalfiber = 0
      var totalprice = 0
      console.log(totalcalorie)
      for(var i = 0 ; i<this.state.jumlahBuah ; i++){
        if(!this.refs[`namaBuah${i}`] || !this.refs[`gram${i}`].value ){
          console.log('masuk')
        }
        else {
          totalweight = parseFloat(totalweight) + parseFloat(this.refs[`gram${i}`].value)
          totalcalorie = parseFloat(totalcalorie) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].calorie * parseFloat(this.refs[`gram${i}`].value))
          totalprotein = parseFloat(totalprotein) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].protein * parseFloat(this.refs[`gram${i}`].value))
          totalFat = parseFloat(totalFat) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].totalFat * parseFloat(this.refs[`gram${i}`].value))
          totalsaturated = parseFloat(totalsaturated) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].saturated * parseFloat(this.refs[`gram${i}`].value))

          totalmufa = parseFloat(totalmufa) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].mufa * parseFloat(this.refs[`gram${i}`].value))
          totalpufa = parseFloat(totalpufa) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].pufa * parseFloat(this.refs[`gram${i}`].value))
          totalcarbohydrat = parseFloat(totalcarbohydrat) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].carbohydrat * parseFloat(this.refs[`gram${i}`].value))
          totalfiber = parseFloat(totalfiber) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].fiber * parseFloat(this.refs[`gram${i}`].value))
          totalprice = parseFloat(totalprice) + parseFloat(this.state.dataAwal[this.refs[`namaBuah${i}`].value].price * parseFloat(this.refs[`gram${i}`].value))

        }
      }
      return (
        <tr>
          <td></td>
          <td className="font-weight-bold">Total :  </td>
          <td className="font-weight-bold text-gray"> {parseFloat(totalweight).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalcalorie).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalprotein).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalFat).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalsaturated).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalmufa).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalpufa).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalcarbohydrat).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{parseFloat(totalfiber).toFixed(2)}</td>
          <td className="font-weight-bold text-gray">{`Rp. `+ numeral(parseFloat(totalprice).toFixed(2)).format(0,0)}</td>
  
        </tr>
      )
    }
   
  }

  saveRecipe = () => {
    let Arr = [];
    let Arr2 = []
    Arr.push(this.NamaRecipe.value)

    for(let i = 0; i < this.state.jumlahBuah; i++) {
      var data = {
        itemId: this.refs[`namaBuah${i}`].value, 
        gram : parseFloat(this.refs[`gram${i}`].value)
      }

      Arr2.push(data)
    }

    Arr.push(Arr2)
    console.log(Arr)

    // Axios.post(URL_API + '/recipe/postrecipe', Arr)
    // .then((res) => {
    //   this.setState({
    //     openModal: false, 
    //     jumlahBuah: 0
    //   })
    // })
    // .catch((err) => {
    //   this.setState({
    //     openModal: false, 
    //     jumlahBuah: 0
    //   })
    // })
  }

  allowPositivesOnly(event) {
    return (event.keyCode? (parseInt(event.keyCode) === 69 ? false : event.keyCode >= 48 && event.keyCode <= 57) : (event.charCode >= 48 && event.charCode <= 57))? true : event.preventDefault();
}

  renderJumlahBuah = () => {
    if(this.state.jumlahBuah !== 0) {
      var Arrjsx = []

      for(let x = 0; x < this.state.jumlahBuah; x++) {
 
        var data = this.state.dataAwal[x]
        // var {calorie, protein, totalFat, saturated, mufa, pufa, carbohydrat, fiber, price} = data
    
 

          Arrjsx.push(
            
        <tr>
            <td>
              {x + 1}
            </td>
            <td>
             <select ref={`namaBuah${x}`} className='form-control' onChange={()=>this.setState({ renderulang : true})}>
              
                {
                  this.state.dataAwal.map((val, index) => {
                    return <option key={index} value={val.id-1}>{val.material}</option>
                  })
                }
             </select>
        
            </td>   
            <td>
                <input type='number' maxLength={4} className='form-control' placeholder='Masukkan berat buah' ref={`gram${x}`}  onChange={()=>this.setState({ renderulang : true})} min='1' max='999'/>
            </td>
            {/* {this.renderNutrisiBuah(this.refs[`namabuah${x}`].value)} */}
  
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].calorie * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].protein * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].totalFat * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].saturated * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].mufa * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].pufa * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].carbohydrat * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].fiber * this.refs[`gram${x}`].value).toFixed(2)}`}</td>
            <td>{!this.refs[`namaBuah${x}`] ? null :   `${parseFloat(this.state.dataAwal[this.refs[`namaBuah${x}`].value].price * this.refs[`gram${x}`].value).toFixed(2)}`}</td>

        </tr>
          )        
      }

      // if(!this.state.finishrender){

      //   this.setState({
      //     finishrender : true
      //   })
      // }
      
      

      return Arrjsx;
    }

  
    return (
      <tr col='4'>
          <td>Belum ada data buah</td>
      </tr>
    )
  }

// renderNutrisiBuah = (data) =>{
//   console.log(data)
// }

// <td>{`${parseFloat(data.calorie).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.protein).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.totalFat).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.saturated).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.mufa).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.pufa).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.carbohydrat).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.fiber).toFixed(2)}`}</td>
// <td>{`${parseFloat(data.price).toFixed(2)}`}</td>
  

  // renderNutritionDetails = (data) => {
  //   return (


  //   )
  // }


  searchRecipe = () => {
    alert(this.refs.searchName.value)
    Axios.get(URL_API + '/recipe/searchrecipe/' + this.refs.searchName.value)
    .then((res) => {
      this.setState({
        data: res.data
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  renderRecipe = () => {
    if(this.state.data.length !== 0) {
      let jsx = this.state.data.map((val, index) => {
        // if(this.state.editSelected === val.id) {
        //  return (
        //    <tr key={index}>
        //      <td>
        //        {val.id}
        //      </td>
        //      <td>
        //        <input type='select'>
        //          <option></option>
        //        </input>
        //      </td>
        //      <td>
        //        <input ref={(beratBuah) => this.beratBuah = beratBuah} type='number' placeholder='Masukkan berat buah' />
        //      </td>
        //      <td>
        //        <input type='button' className='btn btn-success' value='Save' onClick={() => this.EditDataBuah()}/> 
        //      </td>
        //      <td>
        //      <input type='button' className='btn btn-danger' value='Cancel' onClick={() => this.setState({editSelected: null})}/> 
        //      </td>
        //    </tr>
        //  )
        // } 
        
        return (
         <tr key={index}>
            <td>
               {val.id}
             </td>
             <td>
               {val.recipeName}
             </td>
           <td>
           <input type='button' className='btn btn-primary' value='Detail Recipe' onClick={() => this.setState({detailSelected: val.id})}/> 
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

          
            {this.renderAddRecipe(this.state.openModal)}
            <div className='container'>
              <div className='col-12'>
                <input type='button' className='btn btn-secondary form-control mb-3' value='Add New Recipe' onClick={() => this.setState({ openModal: true})}/>

                <input ref='searchName' type='text' className='form-control' placeholder='Search Recipe' />
                <Button className='btn btn-success' onClick={this.searchRecipe}>
                  Search
                </Button>
              </div>
            </div>

            {
              this.state.data.length !== 0 ?
              <div className='container'>
                <div className='row'>
                  <div className='col-12'>
                  <table class="table mt-5">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col">Nama Recipe</th>
                        <th scope='col'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderRecipe()}

                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

                  :
                  null
            }
      </div>
    )
  }
}

export default App;

