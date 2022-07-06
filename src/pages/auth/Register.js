import React, { useState } from 'react';
import './auth.css';
import style from './auth.module.css';
import black from '../../assets/styles/back (1).png';
import google from '../../assets/styles/Vector.png';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../redux/actions/auth';
import swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullname: '',
  });
  const [loading, setLoading] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!form.email || !form.password || !form.fullname) {
      swal.fire('Error!', 'All field must be filled', 'error');
      setLoading(false);
    } else {
      register(form)
        .then((response) => {
          swal.fire('Success!', response.message, 'success').then(() => {
            navigate('/login');
          });
        })
        .catch((err) => {
          swal.fire('Failed!', err.response.data.message, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div>
      <section className={`${style.gradientCustom}`}>
        <div className="container py-3 ">
          <div className="row d-flex justify-content-center align-items-center ">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className={`${style.form} card bg-white `}>
                <div className="card-body p-5 ">
                  <form
                    action=""
                    onSubmit={(e) => {
                      onSubmit(e);
                    }}
                  >
                    <div className="mb-md-5 mt-md-4">
                      <div className={`${style.regist}  d-flex`}>
                        <Link to="/login">
                          <img
                            src={black}
                            width="12px"
                            height="18px"
                            className="mt-2"
                            alt=""
                          />
                        </Link>
                        <h2
                          className={`${style.regis} fw-bold mb-2  text-center`}
                        >
                          Register
                        </h2>
                      </div>
                      <p className={`${style.subLogin}  mt-4`}>
                        Let’s create your account!
                      </p>

                      <div className=" mt-4">
                        <label
                          className={`${style.formLabel}`}
                          htmlFor="typeEmailX"
                        >
                          Name
                        </label>
                        <input
                          type="name"
                          className={`${style.noBorder} form-control `}
                          id="inputEmail3"
                          onChange={(e) => {
                            setForm({ ...form, fullname: e.target.value });
                          }}
                          placeholder="Name"
                        />
                        <div className={`${style.border}`}></div>
                      </div>
                      <div className="mb-4 mt-4">
                        <label
                          className={`${style.formLabel}`}
                          htmlFor="typeEmailX"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                          }}
                          className={`${style.noBorder} form-control `}
                          id="inputEmail3"
                          placeholder="Email"
                        />
                        <div className={`${style.border}`}></div>
                      </div>

                      <div className="mb-4 mt-4">
                        <label
                          className={`${style.formLabel}`}
                          htmlFor="typePasswordX"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className={`${style.noBorder} form-control `}
                          id="inputEmail3"
                          placeholder="Password"
                          onChange={(e) => {
                            setForm({ ...form, password: e.target.value });
                          }}
                        />
                        <div className={`${style.border}`}></div>
                      </div>

                      <p className={`${style.forgot} small  pb-lg-2 text-end `}>
                        Forgot password?
                      </p>

                      <button
                        className={`${style.btnLogin} btn text-center`}
                        type="submit"
                      >
                        {loading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            &nbsp;Loading
                          </>
                        ) : (
                          'Register'
                        )}
                      </button>
                      <div className="col-lg-12 d-flex  mt-5">
                        <div className={`${style.garis}  me-3`}></div>
                        <p className={`${style.loginwith}`}>Register with</p>
                        <div className={`${style.garis}  me-3`}></div>
                      </div>
                      <button
                        className={`${style.btnGoogle} btn text-center d-flex mt-3`}
                        type="submit"
                      >
                        <img
                          className={`${style.iconGoogle}`}
                          src={google}
                          alt=""
                        />
                        <p className={`${style.textGoogle}`}>Google</p>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
