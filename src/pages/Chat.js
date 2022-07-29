/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './style.css';
import { io } from 'socket.io-client';
import icon from '../assets/icons.png';
import Card from '../components/base/card/Card';
import Search from '../components/base/Search/Search';
import Headers from '../components/module/Headers';
import Footer from '../components/module/Footer';
import Menu from '../components/module/Menu';
import MessageSender from '../components/base/message/MessageSender';
import MessageReceived from '../components/base/message/MessageReceived';
import moment from 'moment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailUser, getUser, updatePhoto, updateUser } from '../redux/actions/users';
import swal from 'sweetalert2';
import { HiOutlineViewList } from 'react-icons/hi';
import { IoIosArrowBack, IoIosNotificationsOutline } from 'react-icons/io';
import { FiPlus } from 'react-icons/fi';
import { RiImageEditLine } from 'react-icons/ri';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ScrollToBottom from 'react-scroll-to-bottom';
import Group from '../components/module/Group';

const Chat = () => {
 const dispatch = useDispatch();

  const profile = JSON.parse(localStorage.getItem('user'));
  const receiver = JSON.parse(localStorage.getItem('receiver'));

  const [socketio, setSocketio] = useState(null);
  const [isMessage, setIsMessage] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [getPhoto, setPhoto] = useState('');
  const [getActiveReceiver, setActiveReceiver] = useState({});
  const [search, setSearch] = useState('');
  const [listChat, setListChat] = useState([]);
  const [isDetail, setIsDetail] = useState(false);
  const image =
    'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Kurt&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Pale';
  // const [idMessage, setIdMessage] = useState('');

  useEffect(() => {
    dispatch(getDetailUser());
  }, []);

  const detail = useSelector(state => {
    return state.detail.data;
  });
  console.log(detail);
  const [form, setForm] = useState({
    username: detail.username,
    phone: detail.phone,
    shortName: detail.short_name,
    bio: detail.bio,
    email: detail.email
  });

  const onChangePhoto = (e, field) => {
    setPhoto({
      photo: e.target.files
    });
  };

  // update profil
  const onSave = e => {
    const body = {
      ...form
    };
    e.preventDefault();
    if (!form.username.match(/^[a-zA-Z ']*$/i)) {
      swal.fire({ icon: 'error', title: 'Failed!', text: 'name only alphabet!' });
    } else if (!form.phone.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)) {
      swal.fire({ icon: 'error', title: 'Failed!', text: 'invalid phone number' });
    } else if (form) {
      updateUser(body)
        .then(response => {
          // console.log(response);
          swal.fire('Success!', 'success update profil');
          dispatch(getDetailUser());
        })
        .catch(err => {
          swal.fire('Error!', err, 'error');
          console.log(err);
        });

      if (getPhoto) {
        const changePhoto = new FormData();
        changePhoto.append('photo', getPhoto.photo[0]);

        updatePhoto(changePhoto)
          .then(response => {
            // console.log(response);
            swal.fire('Success!', 'Success update foto profil!');
            // setErorr('');
            dispatch(getDetailUser());
          })
          .catch(err => {
            swal.fire('Error!', err.response.data.error, 'error');
          });
      }
    }
  };

  useEffect(() => {
    dispatch(getUser(search));
  }, [dispatch, search]);

  const { data: users } = useSelector(state => {
    return state.user;
  });

  console.log(listChat);
  // Show menu
  const onMenu = () => {
    if (menu) {
      setMenu(false);
    } else {
      setMenu(true);
    }
  };
  const dates = new Date();
console.log(dates);
  // Show Group
  // const onGroup = () => {
  //   if (isGroup) {
  //     setIsGroup(false);
  //   } else {
  //     setIsGroup(true);
  //   }
  // };

  console.log(isGroup);
  // edit profil
  const onEditProfile = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
    setMenu(false);
  };

  const onDetailProfile = () => {
    if (isDetail) {
      setIsDetail(false);
    } else {
      setIsDetail(true);
    }
  };

  // Notifikasi
  const createNotification = (sender, message) => {
    return NotificationManager.info(message, `New chat from: ${sender}`, 4000);
  };

  // send message
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on('send-message-response', response => {
      const receiver = JSON.parse(localStorage.getItem('receiver'));
      if (response.length > 0) {
        if (receiver.username === response[0].sender || receiver.username === response[0].receiver) {
          setListChat(response);
        } else {
          createNotification(response[response.length - 1].sender, response[response.length - 1].message);
        }
      }
    });
    setSocketio(socket);
  }, []);

  // Delete Message
  const onDelete = e => {
    const data = {
      id: e,
      sender: profile.id,
      receiver: receiver.id
    };
    socketio.emit('delete-message', data);
  };

  // Send Message
  const [message, setMessage] = useState('');

  const onSubmitMessage = e => {
    e.preventDefault();
    const receiver = JSON.parse(localStorage.getItem('receiver'));

    const payload = {
      sender: profile.username,
      senderId: profile.id,
      receiver: receiver.username,
      receiverId: receiver.id,
      message
    };
    setListChat([...listChat, payload]);

    if (message !== '') {
      const data = {
        sender: profile.id,
        receiver: receiver.id,
        isRead: false,
        date: new Date(),
        chatType: 'text',
        message
      };
      socketio.emit('send-message', data);

      dispatch(() => {
        const socket = io(process.env.REACT_APP_API_URL);
        socket.on('send-message-response', response => {
          const receiver = JSON.parse(localStorage.getItem('receiver'));
          if (receiver.username === response[0].sender || receiver.username === response[0].receiver) {
            setListChat(response);
          }
        });
        setSocketio(socket);
      });

      dispatch(getDetailUser());
      setMessage('');
    }
  };

  // Select Receiver
  const selectReceiver = item => {
    setListChat([]);
    setActiveReceiver(item);
    setIsMessage(true);
    localStorage.setItem('receiver', JSON.stringify(item));
    socketio.emit('join-room', profile);

    const data = {
      sender: profile.id,
      receiver: item.id
    };
    socketio.emit('chat-history', data);
  };


  return (
    <div className="sesscion">
      <div className="list-chat">
        {isEdit ? (
          <>
            <div className="fixed edit">
              <div className="flex text-center">
                <IoIosArrowBack
                  onClick={() => onEditProfile()}
                  className="text-arrow"
                />
                {/* <p className="text-secondary text-xl text-center ml-24 mt-[-5px]">{detail.short_name}</p> */}
              </div>
              <div className="detail-photo">
                <img
                  src={detail.photo ? detail.photo : image}
                  alt=""
                  className="photos"
                />
                <label htmlFor="photo" className="cursor-pointer upload-images">
                  <RiImageEditLine className='icon-upload' />
                </label>
                <input className="input-images" type="file" id="photo" hidden onChange={e => onChangePhoto(e, 'photo')} />
                <input
                  className="input-profile"
                  defaultValue={detail.username}
                  onChange={e => {
                    setForm({ ...form, username: e.target.value });
                  }}
                />
                {/* <p className="tex-base text-grey-color mt-2">{detail.short_name}</p> */}
              </div>
              <div className="form-profile">
                <button
                  className="button-save"
                  onClick={e => {
                    onSave(e);
                  }}
                >
                  Save
                </button>
              </div>
              <div className="form-akun">
                <p className="acount">Account</p>
                {/* <p className="text-dark-color font-medium text-lg mt-5">{detail.email}</p> */}
                
                <input
                  id="phone"
                  placeholder=' Tap to change phone number'
                  type="text"
                  defaultValue={detail.phone}
                  onChange={e => {
                    setForm({ ...form, phone: e.target.value });
                  }}
                  className="input-phone "
                />
                <div>
                  <hr className="garis" />
                   <p className="label-username" htmlFor="username">Username</p>
                  <input
                    id="username"
                    type="text"
                    defaultValue={detail.short_name}
                    onChange={e => {
                      setForm({ ...form, shortName: e.target.value });
                    }}
                    className="input-username"
                  />
                 <hr className="garis" />
                </div>
                <div>
                    <p className="label-username" htmlFor="bio">Bio</p>
                  <textarea
                    id="bio"
                    type="text"
                    defaultValue={detail.bio}
                    onChange={e => {
                      setForm({ ...form, bio: e.target.value });
                    }}
                    className="input-bio "
                  />
                 <hr className="garis" />
                </div>
              </div>
            </div>
          </>
        ) : (
           <>
            <div className="fixed list-chats">
              <div className="title-list ">
                <img src={icon} alt="" className="icons" />
                <h3 className="title-tele ">Telegram</h3>
                <HiOutlineViewList className="menu " onClick={() => onMenu()} />
              </div>
              {menu ? <Menu onProfile={() => onEditProfile()} /> : <> </>}
              <div className=" img-title">
                <img
                  src={detail.photo ? detail.photo : image}
                  alt=""
                  className="img-title-card "
                />
                <h5 className="title-username">{detail.username}</h5>
                <p className="title-text">{detail.short_name ? `@ ${detail.short_name}` : '@ hallo '}</p>
              </div>
              <div className="search">
                <Search onChange={e => setSearch(e.target.value)} />
                {/* <FiPlus className="search-icon" /> */}
              </div>
              {/* {isGroup ? <Group /> : <> </>} */}
            </div>
            <div className="history-chats ">
              {users.isLoading ? (
                <div></div>
              ) : users.data ? (
                users.data.map((item, index) => {
                  return item.id !== profile.id ? (
                    <div key={index}>
                      <Card
                        message={
                          item.id === listChat.sender_id ? listChat.message : 'pesan belum ada silahkan kirim pesan'
                        }
                        date={item.date ? item.date : '10.00'}
                        count={item.id !== listChat.sender_id ? listChat.length : 0}
                        onClick={() => selectReceiver(item)}
                        username={item.username}
                        img={item.photo ? item.photo : image}
                      />
                    </div>
                  ) : null;
                })
              ) : null}
            </div>
          </>
        )}
      </div>
      <div className="message ">
        {isMessage ? (
          <div className=" message-header">
            <Headers
              img={receiver.photo ? receiver.photo : image}
              onClick={() => setIsDetail(true)}
              user={receiver.username}
            />

            {/* Detail Profile */}
            {isDetail ? (
              <div className="details">
                <div className="card-details ">
                  <IoIosArrowBack
                    onClick={() => onDetailProfile()}
                    className="cursors"
                  />
                  <p className="short">{receiver.short_name}</p>
                </div>
                <div className="details-photo">
                  <img
                    src={receiver.photo ? receiver.photo : image}
                    alt=""
                    className="photoes "
                  />
                </div>
                <div className=" card-text">
                  <h1 className="username-details">{receiver.username}</h1>
                  <p className="text-online">online</p>
                </div>
                <div className="card-text">
                  <h1 className="username-details">Phone Number</h1>
                  <h1 className="text-phone">{receiver.phone}</h1>
                </div>
                <div className="card-text">
                  <h1 className="username-details">Bio</h1>
                  <h1 className="text-phone">{receiver.bio}</h1>
                </div>
              </div>
            ) : null}

            <div className="messages min-h-screen pt-28 pb-20 bg-primary">
              {listChat.map((item, index) => (
                <div key={index}>
                  <ScrollToBottom className="scrool-buttom">
                    {item.sender === profile.username ? (
                      <MessageSender
                        date={moment(item.date).format('LT')}
                        message={item.message}
                        img={item.sender_photo ? item.sender_photo : image}
                        deletes={() => onDelete(item.id)}
                      />
                    ) : (
                      // <h1>hallo</h1>
                      <MessageReceived
                        date={moment(item.date).format('LT')}
                        message={item.message}
                        img={receiver.photo ? receiver.photo : image}
                      />
                    )}
                  </ScrollToBottom>
                </div>
              ))}
            </div>
            <Footer onSubmit={onSubmitMessage} onChange={e => setMessage(e.target.value)} value={message} />
          </div>
        ) : (
          <div className="kosong ">
            <p className="text-kosong">Please select a chat to start messaging</p>
          </div>
        )}
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Chat;
