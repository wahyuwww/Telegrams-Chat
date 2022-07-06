import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import { login } from '../../redux/actions/auth';
import './auth.css';
import styles from './auth.module.css';
import google from '../../assets/styles/Vector.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';


const Login = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		email: '',
		password: ''
	});
	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		if (!form.email || !form.password) {
			swal.fire(
				'Error!',
				'All field must be filled',
				'error'
			);
			setLoading(false);
		} else {
			login(form)
				.then((response) => {
          console.log(response.message);
					swal.fire(
						'Success!',
						response.message,
						'success'
					).then(() => { navigate('/'); });
				})
				.catch(() => {
					swal.fire(
						'Failed!',
						'email atau password salah !!'
					);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};
  return (
    <div>
      <section className={`${styles.gradientCustom}`}>
        <div className="container py-3 ">
          <div className="row d-flex justify-content-center align-items-center ">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className={`card ${styles.form}  bg-white `}>
                <div className="card-body p-5 ">
                  <form
                    onSubmit={(e) => {
                      onSubmit(e);
                    }}
                  >
                    <div className="mb-md-5 mt-md-4">
                      <h2
                        className={`${styles.login} fw-bold mb-2 login text-center`}
                      >
                        Login
                      </h2>
                      <p className={`${styles.subLogin}  mt-4`}>
                        Hi, Welcome back!
                      </p>

                      <div className="mb-3 mt-4">
                        <label
                          className={`${styles.formLabel}`}
                          htmlFor="typeEmailX"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          className={`${styles.noBorder} form-control `}
                          id="inputEmail3"
                          placeholder="Email"
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                          }}
                        />
                        <div className={`${styles.border}`}></div>
                      </div>

                      <div className="mb-4 mt-4">
                        <label
                          className={`${styles.formLabel}`}
                          htmlFor="typePasswordX"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className={`${styles.noBorder} form-control `}
                          id="inputEmail3"
                          placeholder="Password"
                          onChange={(e) => {
                            setForm({ ...form, password: e.target.value });
                          }}
                        />
                        <div className={`${styles.border}`}></div>
                      </div>

                      <p className={`${styles.forgot} small  pb-lg-2 text-end `}>
                        Forgot password?
                      </p>

                      <button
                        className={`btn ${styles.btnLogin} text-center`}
                        type="submit"
                      >
                        {loading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            &nbsp;Loading
                          </>
                        ) : (
                          'Login'
                        )}
                      </button>
                      <div className="col-lg-12 d-flex mt-5">
                        <div className={`${styles.garis}  me-3`}></div>
                        <p className={`${styles.loginwith}`}>Login with</p>
                        <div className={`${styles.garis}  me-3`}></div>
                      </div>
                      <button
                        className={`${styles.btnGoogle} btn text-center d-flex mt-3`}
                        type="submit"
                      >
                        <img
                          className={`${styles.iconGoogle}`}
                          src={google}
                          alt=""
                        />
                        <p className={`${styles.textGoogle}`}>Google</p>
                      </button>
                      <p className={`${styles.register}mt-5 `}>
                        Dont have an account?{' '}
                        <Link className="fw-bold" to="/register">
                          Register
                        </Link>
                      </p>
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

export default Login;
