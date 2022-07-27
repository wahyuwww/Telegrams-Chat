/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  getDetailUser,
  getUser,
  updatePhoto,
  updateUser,
} from '../redux/actions/users';
import axios from 'axios';
import swal from 'sweetalert2';
import { HiOutlineViewList } from 'react-icons/hi';
import { IoIosArrowBack, IoIosNotificationsOutline } from 'react-icons/io';
import { FiPlus } from 'react-icons/fi';
import { RiImageEditLine } from 'react-icons/ri';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
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

  const detail = useSelector((state) => {
    return state.detail.data;
  });
  console.log(detail);
  const [form, setForm] = useState({
    username: detail.username,
    phone: detail.phone,
    shortName: detail.short_name,
    bio: detail.bio,
    email: detail.email,
  });

  const onChangePhoto = (e, field) => {
    setPhoto({
      photo: e.target.files,
    });
  };

  // update profil
  const onSave = (e) => {
    const body = {
      ...form,
    };
    e.preventDefault();
    if (!form.username.match(/^[a-zA-Z ']*$/i)) {
      swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'name only alphabet!',
      });
    } else if (
      !form.phone.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)
    ) {
      swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'invalid phone number',
      });
    } else if (form) {
      updateUser(body)
        .then((response) => {
          // console.log(response);
          swal.fire('Success!', 'success update profil');
          dispatch(getDetailUser());
        })
        .catch((err) => {
          swal.fire('Error!', err, 'error');
          console.log(err);
        });

      if (getPhoto) {
        const changePhoto = new FormData();
        changePhoto.append('photo', getPhoto.photo[0]);

        updatePhoto(changePhoto)
          .then((response) => {
            // console.log(response);
            swal.fire('Success!', 'Success update foto profil!');
            // setErorr('');
            dispatch(getDetailUser());
          })
          .catch((err) => {
            swal.fire('Error!', err.response.data.error, 'error');
          });
      }
    }
  };

  useEffect(() => {
    dispatch(getUser(search));
  }, [dispatch, search]);

  const { data: users } = useSelector((state) => {
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
    socket.on('send-message-response', (response) => {
      const receiver = JSON.parse(localStorage.getItem('receiver'));
      if (response.length > 0) {
        if (
          receiver.username === response[0].sender ||
          receiver.username === response[0].receiver
        ) {
          setListChat(response);
        } else {
          createNotification(
            response[response.length - 1].sender,
            response[response.length - 1].message
          );
        }
      }
    });
    setSocketio(socket);
  }, []);

  // Delete Message
 const onDelete = async (id) => {
   swal
     .fire({
       title: 'Are you sure to delete this message?',
       text: 'You won\'t be able to revert this!',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes',
     })
     .then(async (result) => {
       if (result.isConfirmed) {
         await axios
           .delete(`${process.env.REACT_APP_API_URL}/chats/${id}`)
           .then((res) => {
             const data = {
               id: id,
               sender: profile.id,
               receiver: receiver.id,
             };
             socketio.emit('delete-message', data);
             swal.fire('Deleted!', 'Your message has been deleted.', 'success');
             console.log(res);
           });
       }
     });
 };


  // Send Message
  const [message, setMessage] = useState('');

  const onSubmitMessage = (e) => {
    e.preventDefault();
    const receiver = JSON.parse(localStorage.getItem('receiver'));

    const payload = {
      sender: profile.username,
      senderId: profile.id,
      receiver: receiver.username,
      receiverId: receiver.id,
      message,
    };
    setListChat([...listChat, payload]);

    if (message !== '') {
      const data = {
        sender: profile.id,
        receiver: receiver.id,
        isRead: false,
        date: new Date(),
        chatType: 'text',
        message,
      };
      socketio.emit('send-message', data);

      dispatch(() => {
        const socket = io(process.env.REACT_APP_API_URL);
        socket.on('send-message-response', (response) => {
          const receiver = JSON.parse(localStorage.getItem('receiver'));
          if (
            receiver.username === response[0].sender ||
            receiver.username === response[0].receiver
          ) {
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
  const selectReceiver = (item) => {
    setListChat([]);
    setActiveReceiver(item);
    setIsMessage(true);
    localStorage.setItem('receiver', JSON.stringify(item));
    socketio.emit('join-room', profile);

    const data = {
      sender: profile.id,
      receiver: item.id,
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
                  className="w-20 h-20 rounded-lg ml-3 object-cover"
                />
                <label htmlFor="photo" className="text-xl cursor-pointer">
                  <RiImageEditLine />
                </label>
                <input
                  type="file"
                  id="photo"
                  hidden
                  onChange={(e) => onChangePhoto(e, 'photo')}
                />
                <input
                  className="mt-3 text-xl font-medium text-center border-b-[1px] border-solid border-dark-color pb-1 focus:outline-none"
                  defaultValue={detail.username}
                  onChange={(e) => {
                    setForm({ ...form, username: e.target.value });
                  }}
                />
                {/* <p className="tex-base text-grey-color mt-2">{detail.short_name}</p> */}
              </div>
              <div className="flex justify-center mt-[-10px]">
                <button
                  className="hover:bg-blue-light bg-secondary rounded-lg text-white font-medium p-2 pl-8 pr-8 flex items-center justify-end"
                  onClick={(e) => {
                    onSave(e);
                  }}
                >
                  Save
                </button>
              </div>
              <div className="overflow-y-scroll mt-80 fixed top-0 bottom-0 max-w-[295px] overflow-hidden">
                <p className="text-dark-color font-medium text-lg mb-5">
                  Account
                </p>
                {/* <p className="text-dark-color font-medium text-lg mt-5">{detail.email}</p> */}
                <label
                  htmlFor="phone"
                  className="text-grey-color text-sm cursor-pointer"
                >
                  Tap to change phone number
                </label>
                <input
                  id="phone"
                  type="text"
                  defaultValue={detail.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                  }}
                  className="w-80 mt-2 focus:outline-none"
                />
                <div>
                  <hr className="text-grey-color mb-5" />
                  <label
                    htmlFor="username"
                    className="text-grey-color font-sm cursor-pointer"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    defaultValue={detail.short_name}
                    onChange={(e) => {
                      setForm({ ...form, shortName: e.target.value });
                    }}
                    className="w-80 focus:outline-none text-dark font-medium"
                  />
                  <hr className="text-grey-color mb-5" />
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="text-grey-color font-sm cursor-pointer"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    type="text"
                    defaultValue={detail.bio}
                    onChange={(e) => {
                      setForm({ ...form, bio: e.target.value });
                    }}
                    className="w-80  focus:outline-none text-dark font-medium min-h-[20px] overflow-hidden max-h-20"
                  />
                  <hr className="text-grey-color" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="fixed bg-white w-1/4 p-2">
              <div className="pl-5 pt-5 flex justify-between">
                <img src={icon} alt="" className="w-10 h-15" />
                <h3 className="text-secondary ml-1 text-2xl font-medium ">
                  Telegram
                </h3>
                <HiOutlineViewList
                  className="text-secondary text-2xl mt-2 cursor-pointer"
                  onClick={() => onMenu()}
                />
              </div>
              {menu ? <Menu onProfile={() => onEditProfile()} /> : <> </>}
              <div className="flex justify-center items-center p-5 flex-col">
                <img
                  src={detail.photo ? detail.photo : image}
                  alt=""
                  className="w-20 h-20 rounded-full ml-3 object-cover"
                />
                <h5 className="mt-3 text-xl font-medium">{detail.username}</h5>
                <p className="tex-base text-grey-color">
                  {detail.short_name ? `@ ${detail.short_name}` : ' '}
                </p>
              </div>
              <div className="pl-5 flex">
                <Search onChange={(e) => setSearch(e.target.value)} />
                <FiPlus className="text-3xl text-secondary mt-3 cursor-pointer" />
              </div>
              {/* {isGroup ? <Group /> : <> </>} */}
            </div>
            <div className="h-auto overflow-y-scroll fixed top-0 bottom-0 mt-[300px] left-0 bg-scroll z-10">
              {users.isLoading ? (
                <div></div>
              ) : users.data ? (
                users.data.map((item, index) => {
                  return item.id !== profile.id ? (
                    <div key={index}>
                      <Card
                        message={
                          item.id === listChat.sender_id
                            ? listChat.message
                            : 'pesan belum ada silahkan kirim pesan'
                        }
                        date={item.date ? item.date : '10.00'}
                        count={
                          item.id !== listChat.sender_id ? listChat.length : 0
                        }
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
                  <p className=" text-xl text-center ml-14 mt-[-5px]">
                    {receiver.short_name}
                  </p>
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
            <Footer
              onSubmit={onSubmitMessage}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen bg-primary">
            <p className="text-grey-color">
              Please select a chat to start messaging
            </p>
          </div>
        )}
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Chat;
