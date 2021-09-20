import { inject, observer } from 'mobx-react';
import React, {useEffect, useState} from 'react';
import Layout from '../../components/layout/front.layout';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import swal from 'sweetalert';
import SubHeader from "../../components/form/SubHeader";
import ExpandedComponent from '../../components/form/ExpandedComponent';

const Index = (props) => {

    const [data,setData] = useState([]);
    const [changeDataCount,setChangeDataCount] = useState(0);
    const [filterData, setFilterData] = useState({
        filteredData : [],
        text : "",
        isFiltered : false
    });
    useEffect(() => {
        axios.get('/api/product',{
            headers:{
                Authorization : "Bearer " + props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setData(res.data.data);
        }).catch(e => swal("Bir Hata Oluştu"))
    }, [changeDataCount]);


    const removeItem = (item) => {
        swal({
            title : "Silmek İstediğinize Emin Misiniz ?",
            text : item.name + " İsimli Ürün Silinecek.",
            buttons: true,
            icon: "warning",
            dangerMode: true
        }).then((willDelete) => {
            if(willDelete){
                axios.delete(`/api/product/${item.id}`,{
                    headers:{
                        Authorization : "Bearer " + props.AuthStore.appState.user.access_token
                    }
                }).then((res) => {
                    if(res.data.success){
                        setChangeDataCount(changeDataCount + 1);
                    }else{
                        swal("Ürün Silinemedi");
                    }
                }).catch(e => swal("Bir Hata Gerçekleşti"));
            }
        });
    }

    const filterDataFunc = (e) => {
        const text = e.target.value;
        if(text != ""){
            const filter = data.filter((item) => (
                item.name && item.name.toLowerCase().includes(text.toLowerCase()) ||
                item.barcode && item.barcode.toLowerCase().includes(text.toLowerCase()) ||
                item.modelCode && item.modelCode.toLowerCase().includes(text.toLowerCase())
            ));
            
            console.log(filter);

            setFilterData({
                filteredData : filter,
                text : text,
                isFiltered: true
            });
        }else{
            setFilterData({
                filteredData : [],
                text : "",
                isFiltered: false
            });
        }
    }

    return (
        <Layout>
            <div className="container mt-5">
                <div className="row text-center">
                    <h3>Ürünler</h3>
                </div>
            <DataTable
                columns={[
                    {
                        name: 'Ürün Adı',
                        selector: row => row.name,
                        sortable: true
                    },
                    {
                        name: 'Model Kodu',
                        selector: row => row.modelCode,
                        sortable: true
                    },
                    {
                        name: 'Barkod',
                        selector: row => row.barcode,
                        sortable: true
                    },
                    {
                        name: 'Satış Fiyatı',
                        selector: row => row.sellingPrice,
                        sortable: true
                    },
                    {
                        name: 'İşlemler',
                        cell: (item) => (
                            <div>
                                <button style={{marginRight:"5px"}} className={"btn btn-sm btn-primary"} onClick={()=>props.history.push(({
                                    pathname : `/products/edit/${item.id}`
                                }))}>Düzenle</button>
                                        <button className={"btn btn-sm btn-danger"} onClick={() => removeItem(item)} >Sil</button>
                            </div>
                        )
                    }
                ]}
                
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                subHeaderComponent = {
                    <SubHeader filter={filterDataFunc} action={{ uri : () => props.history.push('/products/create'), class: "btn btn-sm btn-success", title:"Yeni Ürün Ekle" }} />
                }
                subHeader={true}
                responsive={true}
                hover={true}
                fixedHeader
                pagination
                data={filterData.isFiltered ? filterData.filteredData : data}
            />
            </div>
        </Layout>
    )
}

export default inject("AuthStore")(observer(Index));