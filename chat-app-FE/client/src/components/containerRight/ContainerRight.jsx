import React, { useEffect, useRef, useState } from 'react';
import './containerRight.css'
import {observer} from 'mobx-react-lite'
import _ from 'lodash'
import {useStore} from '../../hook'
import { useHistory, useParams } from 'react-router';
import { Modal,Row,Col,Input,Popover,Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {People,MoreHoriz} from '@material-ui/icons'
import { faChevronUp, faBell, faChevronDown, faBan, faUserSlash, faDotCircle, faThumbsUp, faFont, faSearch, faWrench, faCheck, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faChevronDown, faChevronUp,faBell,faUserSlash,faWrench,faCheck,faSignOutAlt) 
const ContainerRight = observer(({infoRoom,members,messenger}) => {
    const AuthStore = useStore('AuthStore')
    const ActionStore = useStore('ActionStore')
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [activeQVR, setActiveQVR] = useState(false);
    const [active, setActive] = useState(false);
    const [editNameStatus,setEditNameStatus] = useState(false);
    const [reNameGroup,setReNameGroup] = useState(false);
    const [leaveGroup,setLeaveGroup] = useState(false);
    const {conversationId} = useParams(); 
    const history = useHistory();
    const fileShareRef = useRef(null);
    const imageShareRef = useRef(null);
    const [listImage,setListImage] = useState([]);
    const [listFile,setListFile] = useState([]);
    const [member,setMember] = useState(members);
    const [modalMember,setModalMember] = useState(false);
    useEffect(() => {
        messenger.map(value => {
            if(_.isArray(JSON.parse(value.text))) {
                JSON.parse(value.text).map(file => {
                    const arr = file.split('.');
                    const arrName = file.split('_');
                
                    if(arr[arr.length -1] == "pdf" || arr[arr.length -1] == "docx") setListFile(prev => [...prev,{link:file,name: arrName[arrName.length-1]}])
    
                    else if(arr[arr.length -1] == "mp4" )  setListImage(prev => [...prev,file]);
                    else setListImage(prev => [...prev,file]);
                })  
            }
        }) 

        return () => {
            setListFile([]);
            setListImage([]);
        }
        
    },[messenger])
    useEffect(() => {
        setMember(members)
    },[members])
    const handleShow = () => {
        setActive(!active);
    }
    const handleShowQVR = () => {
        setActiveQVR(!activeQVR);
    }

    const handleSearchMess = () => {
        AuthStore.action_searchMess(true);
    }
    //EDIT_Name_Modal
    const editName = (isModalVisible) => {
        const handleCancelEditNameModal = () => {
            setEditNameStatus(false);
        }
        return (
            <Modal title="Ch???nh s???a bi???t danh" visible={isModalVisible}  onCancel={handleCancelEditNameModal} className="modal-edit_name">
                <Row>
                    {!_.isEmpty(member) && member.map(value => {
                        return (
                            <Col span={24} className="modal-edit-profile">
                                <div className="modal-profile-fix">
                                    <img src={value.profilePicture} alt="" />
                                    <input disabled value={value.username} onChange={(e) => {
                                        // e.target.value = e.which
                                        value.username = e.target.value;
                                    }}/>
                                </div>
                                <img src="https://img.icons8.com/pastel-glyph/35/000000/edit--v1.png" 
                                    onClick={(e) => {
                                        const input = e.target.previousElementSibling.children[1];
                                        const check = e.target.nextElementSibling;
                                        check.hidden = false;
                                        input.style.border = "2px #8a8ad8 solid"
                                        e.target.hidden = true;
                                        input.disabled = false;
                                       
                                    }}
                                
                                />
                                <img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/35/000000/external-check-basic-ui-elements-flatart-icons-outline-flatarticons.png" hidden
                                    onClick={(e) => {
                                        const input = e.target.previousElementSibling.previousElementSibling.children[1];
                                        const edit = e.target.previousElementSibling;
                                        const check = e.target;
                                        check.hidden = true;
                                        input.style.border = "none"
                                        edit.hidden = false;
                                        input.disabled = true;
                                        value.username = input.value
                                        ActionStore.action_changePropertyConversation("members",conversationId,members);
                                    }}
                                />
                            </Col>
                        )
                    })}
                </Row>
        
            </Modal>
        )
    }
    //Rename-chat
    const ModalRename = (isModalVisible) => {
        return (
            <Modal title="?????i t??n ??o???n chat" visible={isModalVisible}  
                onCancel={handleCancelReName} 
                onOk={handleAcceptReName}
                okText="L??u"
                cancelText="H???y"
                // okButtonProps={{disabled: true}}
            >
                <Row>
                    <Col span={24}>
                        <Input placeholder={infoRoom.username} onChange={(e) => {
                            infoRoom.username = e.target.value;
                        }}/>
                    </Col>
                </Row>
    
            </Modal>
        )
    }

    const LeaveGroupModal = (isModalVisible) => {
        return (
            <Modal title="B???n c?? ch???c mu???n r???i kh???i cu???c tr?? chuy???n n??y" visible={isModalVisible}  
                onCancel={handleCancelLeaveGroup} 
                onOk={handleLeaveGroup}
                okText="C??"
                cancelText="H???y"
            >
            </Modal>
        )
    }
    const handleCancelLeaveGroup = () => {
        setLeaveGroup(false);
    }
    const handleLeaveGroup =(e) => {
        ActionStore.action_changePropertyConversation('leave',conversationId);
        history.push('/messenger')
    }   
     
    const handleCancelReName = () => {
        setReNameGroup(false);
    }
    const handleAcceptReName = (e) => {
       
        ActionStore.action_changePropertyConversation("name",conversationId,infoRoom.username);
        setReNameGroup(false);
        
    }
   

    //Modal Member
    const modalMembers = (isModalVisible) => {
        const handleCancelMembers = () => {
            setModalMember(false);
        }
        return (
            <Modal title="Th??nh vi??n" visible={isModalVisible}  
                onCancel={handleCancelMembers} 
                
                okText="C??"
                cancelText="H???y"
            >
                <Row>
                    {!_.isEmpty(member) && member.map(value => {
                        return (
                            <Col span={24} style={{display: "flex", alignItems: "center", justifyContent: "space-between",padding: "10px"}}> 
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <img src={value.profilePicture} style={{borderRadius: "50px"}}/>
                                    <div >
                                        <span style={{marginLeft: "10px",fontWeight: "550"}}>{value.username}</span>
                                        <p style={{marginLeft: "10px",fontWeight: "500",color: "#cec3c3",fontSize: "12px"}}>Qu???n tr??? vi??n</p>
                                    </div>
                                   
                                </div>
                                <Popover placement="bottom"  content={<><p>X??a kh???i nh??m</p></>} trigger="click">
                                    <MoreHoriz style={{fontSize: "20px"}}/>
                                </Popover>
                            </Col>
                        )
                    })}
                </Row>
            </Modal>    
        )
    }
    
    return (
        <>
        <div className={`container-right${AuthStore.activeContainer?" active":""}`}>
                    <div className="container-right__head">
                        <div className="container-right__head-avt">
                            <img src={
                                    infoRoom?.profilePicture
                                        ? infoRoom?.profilePicture
                                        : PF + "person/noAvatar.png"
                                    } alt="" className="container-right__head-avt-img avt-mess" />
                        </div>
                        <div className="container-right__head-info">
                            <div className="container-right__head-name name-mess">
                                {infoRoom?.username}
                            </div>
                            <div className="container-right__head-time online">
                                {infoRoom?.status?"??ang ho???t ?????ng":"Kh??ng ho???t ?????ng"}
                            </div>
                        </div>
                    </div>
                    <div className="container-right__menu">
                        <div className="container-right__menu-dropdown" >
                            <div className="dropdown-head" onClick={handleShow}>
                                <div className="dropdown-head__title">
                                    Tu??? ch???nh ??o???n chat
                                </div>
                                <div className="dropdown-head__icon" hidden={active}>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                                <div className="dropdown-head__icon" hidden={!active}>
                                    <FontAwesomeIcon icon={faChevronUp} />
                                </div>
                            </div>
                            <ul className={`dropdown-list${active? " active": ""}`}>
                                    {infoRoom.isGroup && 
                                         <li className="dropdown-item dropdown-item-rename" onClick={() => {
                                            setReNameGroup(true);
                                        }}>
                                            <div className="dropdown-item__icon">
                                                <img src="https://img.icons8.com/pastel-glyph/18/000000/edit--v1.png"/>
                                            </div>
                                            <div className="dropdown-item__text">
                                                ?????i t??n ??o???n chat
                                            </div>
                                        </li>
                                    }
                               

                                    {infoRoom.isGroup && 
                                        <li className="dropdown-item" onClick={() => {
                                            setModalMember(true);
                                        }}>
                                            <div className="dropdown-item__icon">
                                                <People/>
                                            </div>
                                            <div className="dropdown-item__text">
                                                Th??nh vi??n trong nh??m
                                            </div>
                                        </li>
                                    }
                                

                               
                                
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </div>
                                    <div className="dropdown-item__text">
                                        Thay ?????i bi???u t?????ng c???m x??c
                                    </div>
                                </li>
                                <li className="dropdown-item" onClick={() => setEditNameStatus(true)}>
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faFont} />
                                    </div>
                                    <div className="dropdown-item__text">
                                        Ch???nh s???a bi???t danh
                                    </div>
                                </li>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </div>
                                    <div className="dropdown-item__text" onClick={handleSearchMess}>
                                        T??m ki???m trong cu???c tr?? chuy???n
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="container-right__menu-dropdown" onClick={handleShowQVR}>
                            <div className="dropdown-head">
                                <div className="dropdown-head__title">
                                    {`Quy???n ri??ng t?? & h??? tr???`}
                                </div>
                                <div className="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} hidden={activeQVR}/>
                                </div>
                                <div className="dropdown-head__icon"  hidden={!activeQVR}>
                                    <FontAwesomeIcon icon={faChevronUp}/>
                                </div>
                            </div>
                            <ul className={`dropdown-list${activeQVR? " activeQVR": ""}`}>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faBell}/>
                                    </div>
                                    <div className="dropdown-item__text">
                                        T???t ??m cu???c tr?? chuy???n
                                    </div>
                                </li>
                                
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faBan}/>
                                    </div>
                                    <div className="dropdown-item__text">
                                        B??? qua tin nh???n
                                    </div>
                                </li>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <FontAwesomeIcon icon={faUserSlash}/>
                                    </div>
                                    <div className="dropdown-item__text">
                                        Ch???n
                                    </div>
                                </li>
                                <li className="dropdown-item">
                                    <div className="dropdown-item__icon">
                                        <i className="fal fa-search"></i>
                                    </div>
                                    <div className="dropdown-item__text">
                                        C?? g?? ???? kh??ng ???n 
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="container-right__menu-dropdown container-right__menu-dropdown-file_share" 
                            onClick={(e) => {
                                const element = fileShareRef.current.getAttribute("class");
                                if(element.indexOf("hidden_icon") != -1) {
                                    fileShareRef.current.classList.remove("hidden_icon");
                                } else fileShareRef.current.classList.add("hidden_icon");
                            }}>
                            <div className="dropdown-head">
                                <div className="dropdown-head__title">
                                    T???p ???????c chia s???
                                </div>
                                <div className="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                            <Row ref={fileShareRef} className="hidden_icon">
                                {!_.isEmpty(listFile)?
                                    listFile.map(file => {
                                        return (
                                            <Col span={24}>
                                                <a href={file.link}>{file.name}</a>
                                            </Col>
                                        )
                                    }):
                                    <Col span={6} className="file_share-no_data">No files</Col>
                            
                                }
                            </Row>
                        </div>

                        <div className="container-right__menu-dropdown container-right__menu-dropdown-image-share" onClick={() =>{
                            const element = imageShareRef.current.getAttribute("class");
                            if(element.indexOf("hidden_icon") != -1) {
                                imageShareRef.current.classList.remove("hidden_icon");
                            } else imageShareRef.current.classList.add("hidden_icon");
                        }}>
                            <div className="dropdown-head">
                                <div className="dropdown-head__title">
                                    File ph????ng ti???n ???????c chia s???
                                </div>
                                <div className="dropdown-head__icon">
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>

                            <Row ref={imageShareRef} className="hidden_icon">
                               {listImage.map(link => {
                                   return (
                                    <Col span={8}>
                                        <img src={link} alt="" />
                                    </Col>
                                   )
                               })}
                            </Row>
                        </div>


                        {infoRoom.isGroup && 
                            <div className="container-right__menu-dropdown right-bar-out_room" onClick={() => {
                                setLeaveGroup(true);
                            }}>
                                <div className="dropdown-head">
                                    <div className="dropdown-head__title">
                                    <FontAwesomeIcon icon={faSignOutAlt} /> R???i kh???i nh??m
                                    </div>
                                </div>
                            </div>
                        }
                       

                    </div>
                </div>
                {editName(editNameStatus)}
                {ModalRename(reNameGroup)}
                {LeaveGroupModal(leaveGroup)}
                {modalMembers(modalMember)}
                </>
    );
})

export default ContainerRight;