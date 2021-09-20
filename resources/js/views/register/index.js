import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { inject,observer } from 'mobx-react';

const Register = (props) => {

    useEffect(()=>{
        if(props.AuthStore.appState != null){
            if(props.AuthStore.appState.isLoggedIn){
                return props.history.push("/");
            }
        }  
    });

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState('')

    const handleSubmit = (values) => {
        axios.post('api/auth/register',{...values})
        .then((res) => {
            if(res.data.success){
                const userData = {
                    id : res.data.id,
                    name : res.data.name,
                    email : res.data.email,
                    access_token : res.data.access_token
                };
                const appState = {
                    isLoggedIn : true,
                    user : userData
                };
                props.AuthStore.saveToken(appState);
                props.history.push("/");
            }else{
                alert("Bilgiler Hatalı");
            }
        })
        .catch(error => {
            if(error.response){
                let err = error.response.data;
                setErrors(err.errors);
            }else if(error.request){
                let err = error.request;
                setError(err);
            }else{
                setError(error.message);
            }
        });
    }

    let arr = [];
    Object.values(errors).forEach(value => {
        arr.push(value);
    })

    return (
        <div style={{ width:'100%' }} className="text-center d-flex align-items-center justify-content-center">
            <main className="form-signin" style={{ width:365 }}>
            <form>
                <img className="mb-4" src="/img/bootstrap-logo.svg" alt="" width="72" height="57"/>
                <h1 className="h3 mb-3 fw-normal">Kayıt Ol</h1>
                { arr.length != 0 && arr.map((item) => (<p>{item}</p>)) }
                { error != '' &&  (<p>{error}</p>)} 
                <Formik
                    initialValues={{
                        name:'',
                        email:'',
                        password:'',
                        password_confirmation:''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema= {
                        Yup.object().shape({
                            email:Yup.string().email("Geçerli bir e-mail alanı giriniz").required("E-mail alanı zorunlu"),
                            name: Yup.string().required("Ad soyad alanı zorunlu"),
                            password: Yup.string().required("Şifre alanı zorunlu"),
                            password_confirmation: Yup.string().oneOf([Yup.ref('password'),null],"Şifreler Eşleşmiyor")
                        })
                    }
                >
                    {({
                        values,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                        errors,
                        isValid,
                        isSubmitting,
                        touched
                    })=>(
                  <div>      
                <div className="form-floating">
                    <input type="text" className="form-control" placeholder="name"
                    name="name"
                    onBlur={handleBlur}
                    value={values.name}
                    onChange={handleChange('name')}
                    />
                    {(errors.name && touched.name) && <p>{errors.name}</p>}
                    <label for="floatingInput">Ad Soyad</label>
                </div>

                <div className="form-floating">
                <input type="email" className="form-control" placeholder="name@example.com"
                    name="email"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange('email')}
                    />
                    {(errors.email && touched.email) && <p>{errors.email}</p>}
                <label for="floatingInput">Email</label>
                </div>
                <div className="form-floating">
                <input type="password" className="form-control" placeholder="Password"
                    name="password"
                    onBlur={handleBlur}
                    value={values.password}
                    onChange={handleChange('password')}
                    />
                    {(errors.password && touched.password) && <p>{errors.password}</p>}
                <label for="floatingPassword">Şifre</label>
                </div>
                <div className="form-floating">
                <input type="password" className="form-control"  placeholder="Password Confirm"
                name="password_confirmation"
                onBlur={handleBlur}
                value={values.password_confirmation}
                onChange={handleChange('password_confirmation')}
                />
                {(errors.password_confirmation && touched.password_confirmation) && <p>{errors.password_confirmation}</p>}
                <label for="floatingPassword">Şifre Tekrar</label>
                </div>
                <button
                disabled={!isValid || isSubmitting}
                onClick={handleSubmit}
                className="w-100 btn btn-lg btn-primary" type="submit">Kayıt Ol</button>
                </div>
                )}
                </Formik>
                <Link to="/login" className="d-block mt-3 btn-sm btn-secondary">Giriş</Link>
                <p className="mt-5 mb-3 text-muted">© 2017–2021</p>
            </form>
        </main>
        </div>
    )
}

export default inject("AuthStore")(observer(Register));