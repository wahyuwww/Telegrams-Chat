/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import Card from '../components/card/Card';
import Search from '../components/Search/Search';
import Headers from '../components/main/Headers';
import Footer from '../components/main/Footer';
import Menu from '../components/main/Menu';
import Bubbles from '../components/bubbles/Bubbles';
import BubblesReceived from '../components/bubbles/BubblesReceived';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailUser, getUser, updatePhoto, updateUser } from '../redux/actions/users';
import swal from 'sweetalert2';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { IoIosArrowBack, IoIosNotificationsOutline } from 'react-icons/io';
import { FiPlus } from 'react-icons/fi';
import { RiChatSettingsLine } from 'react-icons/ri';
import { MdOutlineLock, MdOutlineDevicesOther } from 'react-icons/md';
import { VscGraphLine } from 'react-icons/vsc';
import { RiImageEditLine } from 'react-icons/ri';


export default function Chat(params) {
  const dispatch = useDispatch();

  const profile = JSON.parse(localStorage.getItem('user'));
  const receiver = JSON.parse(localStorage.getItem('receiver'));

  const [socketio, setSocketio] = useState(null);
  const [isMessage, setIsMessage] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [getPhoto, setPhoto] = useState('');
  const [getActiveReceiver, setActiveReceiver] = useState({});
  const [getQuery, setQuery] = useState('');
  const [listChat, setListChat] = useState([]);
  const [isDetail, setIsDetail] = useState(false);
  const image =
    'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Kurt&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Pale';
  const [idMessage, setIdMessage] = useState('');

  const [getErorr, setErorr] = useState('');

  useEffect(() => {
    dispatch(getDetailUser());
  }, []);

  const detail = useSelector(state => {
    return state.detail.data;
  });

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

  const onChange = (e, field) => {
    e.preventDefault();
    setForm({
      ...form,
      [field]: e.target.value
    });
  };
console.log(listChat);
  // Save
  const onSave = () => {
    const body = {
      ...form
    };

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
          console.log(err);
        });

      if (getPhoto) {
        const changePhoto = new FormData();
        changePhoto.append('photo', getPhoto.photo[0]);

        updatePhoto(changePhoto)
          .then(response => {
            // console.log(response);
             swal.fire('Success!', 'Success update foto profil!');
            setErorr('');
            dispatch(getDetailUser());
          })
          .catch(err => {
             swal.fire('Error!', err.response.data.error, 'error');
          });
      }
    }
  };

  useEffect(() => {
    dispatch(getUser(getQuery));
  }, [dispatch, getQuery]);

  const { data : users} = useSelector(state => {
    return state.user;
  });
  // Show menu
  const onMenu = () => {
    if (isMenu) {
      setIsMenu(false);
    } else {
      setIsMenu(true);
    }
  };

  // Change to edit profile
  const onEditProfile = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
    setIsMenu(false);
  };

  const onDetailProfile = () => {
    if (isDetail) {
      setIsDetail(false);
    } else {
      setIsDetail(true);
    }
  };

  //
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on('send-message-response', response => {
      const receiver = JSON.parse(localStorage.getItem('receiver'));
      if (receiver.username === response[0].sender || receiver.username === response[0].receiver) {
        setListChat(response);
      }
    });
    setSocketio(socket);
  }, []);

  console.log(idMessage);
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
    <div className="grid grid-cols-4 gap-4">
      <div className="w-full col-span-1">
        {isEdit ? (
          <>
            <div className="fixed bg-white w-1/4 p-5 pt-7">
              <div className="flex text-center">
                <IoIosArrowBack
                  onClick={() => onEditProfile()}
                  className="text-secondary text-xl ml-[-5px] cursor-pointer"
                />
                {/* <p className="text-secondary text-xl text-center ml-24 mt-[-5px]">{detail.short_name}</p> */}
              </div>
              <div className="flex justify-center items-center p-5 flex-col mt-3">
                <img
                  src={detail.photo ? detail.photo : image}
                  alt=""
                  className="w-20 h-20 rounded-3xl ml-3 object-cover"
                />
                <label htmlFor="photo" className="text-xl cursor-pointer">
                  <RiImageEditLine />
                </label>
                <input type="file" id="photo" hidden onChange={e => onChangePhoto(e, 'photo')} />
                <input
                  className="mt-3 text-xl font-medium text-center border-b-[1px] border-solid border-dark-color pb-1 focus:outline-none"
                  defaultValue={detail.username}
                  onChange={e => onChange(e, 'username')}
                  onClick={() => setErorr('')}
                />
                {/* <p className="tex-base text-grey-color mt-2">{detail.short_name}</p> */}
              </div>
              <div className="flex justify-center mt-[-10px]">
                <button
                  className="bg-secondary rounded-sm text-white font-medium p-2 pl-8 pr-8 flex items-center justify-end"
                  onClick={e => onSave(e)}
                >
                  Save
                </button>
              </div>
              {getErorr ? <p className="text-red-light text-[13px] mt-2">{getErorr}</p> : null}
              <div className="overflow-y-scroll mt-80 fixed top-0 bottom-0 max-w-[295px] overflow-hidden">
                <p className="text-dark-color font-medium text-lg">Account</p>
                <input
                  id="phone"
                  type="text"
                  defaultValue={detail.phone}
                  onChange={e => onChange(e, 'phone')}
                  onClick={() => setErorr('')}
                  className="w-80 mt-2 focus:outline-none"
                />
                <label htmlFor="phone" className="text-secondary text-sm mt-1 cursor-pointer">
                  Tap to change phone number
                </label>
                <div>
                  <hr className="text-grey-color mt-5" />
                  <input
                    id="username"
                    type="text"
                    defaultValue={detail.short_name}
                    onChange={e => onChange(e, 'shortName')}
                    className="w-80 focus:outline-none text-dark font-medium mt-5"
                  />
                  <label htmlFor="username" className="text-grey-color font-sm cursor-pointer">
                    Username
                  </label>
                  <hr className="text-grey-color mt-5" />
                </div>
                <div>
                  <textarea
                    id="bio"
                    type="text"
                    defaultValue={detail.bio}
                    onChange={e => onChange(e, 'bio')}
                    className="w-80  focus:outline-none text-dark font-medium mt-5 min-h-[20px] overflow-hidden max-h-20"
                  />
                  <label htmlFor="bio" className="text-grey-color font-sm cursor-pointer">
                    Bio
                  </label>
                </div>
                <div className="relative">
                  <p className="text-dark-color font-medium text-lg mt-5">Setting</p>
                  <ul className="mt-3">
                    <li className="flex text-dark text-center text-lg cursor-pointer">
                      <IoIosNotificationsOutline className="mt-1 mr-5 text-2xl" />
                      Notification and Sounds
                    </li>
                    <li className="flex text-dark text-center text-lg cursor-pointer mt-4">
                      <MdOutlineLock className="mt-1 mr-5 text-2xl" />
                      Privaty and Security
                    </li>
                    <li className="flex text-dark text-center text-lg cursor-pointer mt-4">
                      <VscGraphLine className="mt-1 mr-6 text-xl" />
                      Data and Stronge
                    </li>
                    <li className="flex text-dark text-center text-lg cursor-pointer mt-4">
                      <RiChatSettingsLine className="mt-1 mr-5 text-xl" />
                      Chat settings
                    </li>
                    <li className="flex text-dark text-center text-lg cursor-pointer mt-4">
                      <MdOutlineDevicesOther className="mt-1 mr-5 text-xl mb-10" />
                      Devices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="fixed bg-white w-1/4 p-2">
              <div className="pl-5 pt-5 flex justify-between">
                <h3 className="text-secondary text-2xl font-medium">Telegram</h3>
                <HiOutlineMenuAlt1 className="text-secondary text-2xl mt-2 cursor-pointer" onClick={() => onMenu()} />
              </div>
              {isMenu ? <Menu onProfile={() => onEditProfile()} /> : <> </>}
              <div className="flex justify-center items-center p-5 flex-col">
                <img
                  src={detail.photo ? detail.photo : image}
                  alt=""
                  className="w-20 h-20 rounded-3xl ml-3 object-cover"
                />
                <h5 className="mt-3 text-xl font-medium">{detail.username}</h5>
                <p className="tex-base text-grey-color">{detail.short_name}</p>
              </div>
              <div className="pl-5 flex">
                <Search onChange={e => setQuery(e.target.value)} />
                <FiPlus className="text-3xl text-secondary mt-3" />
              </div>
            </div>
            <div className="h-auto overflow-y-scroll fixed top-0 bottom-0 mt-[300px] left-0 bg-scroll z-10">
              {users.isLoading ? (
                <div></div>
              ) : users.data ? (
                users.data.map((item, index) => {
                  return item.id !== profile.id ? (
                    <div key={index}>
                      <Card
                        // message={item.message}
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
      <div className=" border-solid border-l-[1px] col-span-3 border-grey-color">
        {isMessage ? (
          <div className="relative overflow-hidden">
            <Headers
              img={receiver.photo ? receiver.photo : image}
              onClick={() => setIsDetail(true)}
              user={receiver.username}
            />

            {/* Detail Profile */}
            {isDetail ? (
              <div className="z-30 absolute right-0 w-72 h-screen p-5 bg-white shadow-lg">
                <div className="flex text-center mt-4">
                  <IoIosArrowBack
                    onClick={() => onDetailProfile()}
                    className="text-black text-xl ml-[-5px] cursor-pointer rotate-180"
                  />
                  <p className=" text-xl text-center ml-14 mt-[-5px]">{receiver.short_name}</p>
                </div>
                <div className="flex items-center justify-center mt-10">
                  <img
                    src={receiver.photo ? receiver.photo : image}
                    alt=""
                    className="h-24 w-24 rounded-xl ml-3 cursor-pointer"
                  />
                </div>
                <div className="mt-5">
                  <h1 className="font-medium text-xl">{receiver.username}</h1>
                  <p className="text-secondary text-sm">online</p>
                </div>
                <div className="mt-3">
                  <h1 className="text-lg font-medium ">Phone Number</h1>
                  <h1 className="text-md">{receiver.phone}</h1>
                </div>
                <div className="mt-3">
                  <h1 className="text-lg font-medium ">Bio</h1>
                  <h1 className="text-md">{receiver.bio}</h1>
                </div>
              </div>
            ) : null}

            <div className="min-h-screen pt-28 pb-20 bg-primary">
              {listChat.map((item, index) => (
                <div key={index}>
                  {item.sender === profile.username ? (
                    <Bubbles
                      date={moment(item.date).format('lll')}
                      message={item.message}
                      img={item.sender_photo ? item.sender_photo : image}
                      deletes={() => onDelete(item.id)}
                    />
                  ) : (
                    // <h1>hallo</h1>
                    <BubblesReceived
                      date={moment(item.date).format('lll')}
                      message={item.message}
                      img={receiver.photo ? receiver.photo : image}
                    />
                  )}
                </div>
              ))}
            </div>
            <Footer onSubmit={onSubmitMessage} onChange={e => setMessage(e.target.value)} value={message} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen bg-primary">
            <p className="text-grey-color">Please select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
