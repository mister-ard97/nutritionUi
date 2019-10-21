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

    openModal: false,
  }

  componentDidMount() {
    document.title = 'Nutrition Calculation';

    Axios.get(URL_API + '/item/getItem')
    .then((res) => {
      this.setState({
        dataAwal: res.data
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  renderAddRecipe = () => {
    return (
      <Modal isOpen={this.state.openModal} toggle={this.toggle} size='xl'>
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
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderJumlahBuah()}

                    </tbody>
                  </table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.saveRecipe}>Save</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }

  saveRecipe = () => {
    let Arr = [];
    let Arr2 = []
    Arr.push(this.NamaRecipe.value)

    for(let i = 0; i < this.state.jumlahBuah; i++) {
      var data = {
        itemId: this.refs[`namaBuah${i}`].value, 
        gram : this.refs[`gram${i}`].value
      }

      Arr2.push(data)
    }

    Arr.push(Arr2)

    Axios.post(URL_API + '/recipe/postrecipe', Arr)
    .then((res) => {
      this.setState({
        openModal: false, 
        jumlahBuah: 0
      })
    })
    .catch((err) => {
      this.setState({
        openModal: false, 
        jumlahBuah: 0
      })
    })
  }

  renderJumlahBuah = () => {
    if(this.state.jumlahBuah !== 0) {
      var Arrjsx = []

      for(let x = 0; x < this.state.jumlahBuah; x++) {
          Arrjsx.push(
            <tr>
            <td>
              {x + 1}
            </td>
            <td>
             <select ref={`namaBuah${x}`} className='form-control'>
                <option value=''>Pilih bahan</option>
                {
                  this.state.dataAwal.map((val, index) => {
                    return <option key={index} value={val.id}>{val.material}</option>
                  })
                }
             </select>
            </td>   
            <td>
                <input type='number' className='form-control' placeholder='Masukkan berat buah' ref={`gram${x}`}/>
            </td>

        </tr>
          )        
      }

      return Arrjsx;
    }

    return (
      <tr col='4'>
          <td>Belum ada data buah</td>
      </tr>
    )
  }

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

