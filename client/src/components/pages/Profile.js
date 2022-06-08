import React, { useState, useEffect, useRef, useContext } from 'react'
import useWindowDimensions from './../../utils/useWindowDimensions';
import { Grid, Button, CssBaseline, Divider, Typography, styled, Tabs, Tab, IconButton,
    Dialog, DialogTitle,DialogContent,DialogActions } from '@mui/material/';
import CloseIcon  from '@mui/icons-material/Close';
import AlertDialog from '../../layout/AlertDialog';
import MoreButtonDialog from './../MoreButtonDialog';
import useOutsideClick from './../../utils/useOutsideClick';
import KeyIcon from '@mui/icons-material/Key';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Channel from "../../layout/AvaTy"
import PersonalInfos from '../PersonalInfos'
import ChangePwd from '../ChangePwd'
import TagsInput from './../../layout/TagsInput';
import InputField from '../../layout/InputField';
import axios from 'axios';
import moment from 'moment';
import { channelURL, userURL } from './../../config/Config';
import { useParams } from 'react-router-dom';
import AuthContext from './../../context/AuthContext';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileInput from './../../layout/FileInput';
import FormData from 'form-data'
import DeleteIcon from '@mui/icons-material/Delete';
const { IvsClient, CreateChannelCommand, CreateRecordingConfigurationCommand, GetStreamCommand  } = require("@aws-sdk/client-ivs");

const Profile = () => {
    const {height}=useWindowDimensions();
    const {user,setUser}=useContext(AuthContext);
    const [userInfo, setUserInfo]=useState("");
    const [streamServer, setStreamServer] = useState("");
    const [streamKey, setStreamKey] = useState("");
    const [playbackUrl, setPlaybackUrl] = useState("");
    const [isMe, setIsMe]=useState(false);
    const [channels, setChannels] = useState(["123","456"]);
    const [followedchannels, setFollowedchannels]=useState([])
    const [value, setValue] = useState('Personal Infos');
    const [editInfosIsOpen, setEditInfosIsOpen] = useState(false);
    const [createChannelIsOpen, setCreateChannelIsOpen] = useState(false);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [username, setUsername]=useState('');
    const [firstName, setFirstName]=useState('');
    const [lastName, setLastName]=useState('');
    const [email, setEmail]=useState('');
    const [country, setCountry]=useState('');
    const [gender, setGender]=useState('');

    const [birthday, setBirthday]=useState();
    const [phone, setPhone]=useState();
    const [channelNameError, setChannelNameError] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [channelTags, setChannelTags] = useState([]);
    const dialogRef=useRef(null);
    const moreButtonRef=useRef(null);
    let { username:usernameParam } = useParams(); 
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

   useEffect(()=>{
     const check= async()=>{
        if(user.username===usernameParam){
            setIsMe(true)
            setUserInfo(user)
        }else{
            console.log("chihaja")
           setIsMe(false)
           await axios.get(`${userURL}/${usernameParam}`).then((res)=>{
            setUserInfo(res.data)
           })  
        }
     }
     check()
   },[user,usernameParam])
  
   useEffect(()=>{
      if(userInfo){
          //get all channels

          //get followedchannels

      }
   },[userInfo])

    useOutsideClick(dialogRef,moreButtonRef,() => setDialogIsOpen(false));
    
    const editPost=()=>{
        setEditInfosIsOpen(true);
    }
    
    const createChannel = () => {
        setCreateChannelIsOpen(true);
    }

    const handleSavePost=()=>{
        setEditInfosIsOpen(false);

    }

    const handleTagsList =(items) =>{
        setChannelTags(items);
    }
    const handleCreateChannel= async ()=>{
        if(!channelName.trim()){
            setChannelNameError('Channel name is required');
            return;
        }
        setChannelNameError('');
        const accessKeyId= "AKIAX3ZF5PP272EJEPW6";
        const secretAccessKey = "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";
        var config = {
            "region": "eu-west-1",
            "credentials": {
                "accessKeyId": accessKeyId,
                "secretAccessKey": secretAccessKey
            }
        }
        var newChannel = {
            "authorized": false,
            "latencyMode": "NORMAL",
            "name": "test-chan-1",
            "recordingConfigurationArn": "", //"arn:aws:ivs:eu-west-1:540708535285:recording-configuration/cnBP9yHwYpjJ", 
            "type": "BASIC"
        }
        /*var newBucket = {
            'destinationConfiguration': {
                's3': {
                    'bucketName': 'kouttane-bucket'
                }
            }
        }*/

        const client = new IvsClient(config);
        const channelCommand = new CreateChannelCommand(newChannel);
        //const bucketCommand = new CreateRecordingConfigurationCommand(newBucket);
        const channelRes = await client.send(channelCommand);
        //const bucketRes = await client.send(bucketCommand);
       
        const data={
            name:channelName,
            userId:user._id,
            description:channelDescription,
            tags:channelTags,
            streamServer:channelRes.channel.ingestEndpoint,
            streamKey:channelRes.streamKey.value,
            playbackUrl:channelRes.channel.playbackUrl
        }
        
        await axios.post(channelURL, data).then(res=>{
            console.log(res);
        })
        setCreateChannelIsOpen(false);
    }
    const handleCancelCreateChannel=()=>{
        setCreateChannelIsOpen(false);
    }

    const handleFileUpload= async (e)=>{
        console.log("e.target.files[0]")
        console.log(e.target.files[0])
        const file  =e.target.files[0]
        let dataa = new FormData();
        dataa.append('image', file);
         /* let formData = new FormData();
      formData.append("image", e.target.files[0]);
      await axios.post(`${userURL}/image/upload`,formData).then(res=>{
            console.log(res)
        })
        const res = await fetch(`${userURL}/image/upload`, {
        method: "POST",
        body: formData,
      });
      console.log(res)*/
      const res=await axios.post(`${userURL}/image/upload`, dataa, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${dataa._boundary}`,
        }
      })
        console.log(res)
       const upData={
            profileImg:{
                url:res.data.secure_url,
                cloudinary_id:res.data.public_id
            }
        }
        await axios.put(`${userURL}/${userInfo._id}`, upData).then((res)=>{
          localStorage.setItem("user",JSON.stringify(res.data))
        //  setUser(res.data)
       })
       
    }

    const handleDeleteProfile = async()=>{
        /* await axios.delete(`${userURL}/image/delete/${userInfo.profileImg.cloudinary_id}`).then((res)=>{
             console.log(res)
         })*/
         const upData={
             profileImg:{
                 url:"",
                 cloudinary_id:''
             }
         }
         await axios.put(`${userURL}/${userInfo._id}`, upData).then((res)=>{
           localStorage.setItem("user",JSON.stringify(res.data))
          // setUser(res.data)
           
        })
    }
    
    return (
        <Grid container direction="row" sx={{height:height ,overflow:'auto'}} >
            <CssBaseline />
            <Grid item xs={3} sx={styles.firstcol} >
            <Grid sx={{position: 'relative',top: 0,left: 0}}>
            {userInfo &&<img src={userInfo.profileImg.url ? userInfo.profileImg.url:'/profile.jpg'} alt='' style={styles.profilePic} />}
                {isMe && <Grid  sx={{zIndex:'40',display:'flex',position: 'absolute',bottom: 15,right: 30}}>
                    <FileInput handleFileUpload={handleFileUpload}/>
                    <DeleteIcon onClick={handleDeleteProfile} sx={{cursor:'pointer', color:'color.main'}}/>
                    </Grid>}
            </Grid>
               
                <Grid container direction="row" alignItems="center" >
                    <Grid item xs={3}>
                        <Typography variant="subtitle1" component="div" gutterBottom fontWeight="bold">
                            Channels
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Divider sx={{marginRight:'20px'}} />
                    </Grid> 
                    {channels && channels.map((channel,index)=>(
                        <Channel srcImg='profile.jpg' name="chaine dial lqhab" sx={styles.channelsList} />
                    ))
                    }
                    {!channels &&  <Typography variant="body1" component="div" gutterBottom>
                        No available channels.
                    </Typography>
                    }                
                   {isMe && <Button  
                        variant="contained"
                        sx={styles.button}
                        onClick={createChannel}
                    >
                        Create New Channel
                    </Button>}
                </Grid>
            </Grid>

            <Grid item xs={9} sx={styles.secondcol} >
                <Typography variant="h4" component="div" >
                   {userInfo && <span>{`${userInfo.firstName} ${userInfo.lastName}`}</span>}
                </Typography>
                <Typography variant="h5"  component="div">
                {userInfo && <span>{`${userInfo.username}`}</span>}
                </Typography>
                <Grid container direction="row" sx={styles.location} >
                    <LocationOnIcon />
                    <Typography variant="subtitle1" component="div">
                        {userInfo &&(
                            <>
                                {userInfo.country ?(
                                    <span>{userInfo.country}</span>
                                ):(
                                    <span>Undetermined</span>
                                )}
                            </>
                        )}
                    </Typography>
                </Grid>
                <Grid container direction="row" sx={styles.joinedOn} >
                    <Typography variant="subtitle1" component="div">
                        Joined on:{userInfo && <span>{moment(userInfo.timestamp).format('LL')}</span>}
                    </Typography>
                </Grid>
                <Grid item xs={10} sx={styles.editIcon}>
                    <Typography variant="subtitle1" component="div" gutterBottom fontWeight="bold" >
                        Personal information
                    </Typography>
                   {isMe && <EditIcon 
                        onClick={editPost}
                        sx={{cursor:'pointer'}}
                    />}
                </Grid>
                <Divider sx={{marginRight:'160px', marginBottom:'30px'}} />
                <Grid container direction="row" sx={styles.personalInfos} >
                    <Typography variant="subtitle1" component="div" fontWeight="bold" >
                        Gender
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                    {userInfo &&(
                            <>
                                {userInfo.gender ?(
                                    <span>{userInfo.gender}</span>
                                ):(
                                    <span>Undetermined</span>
                                )}
                            </>
                        )}
                    </Typography>
                </Grid>
                <Grid container direction="row" sx={styles.personalInfos} >
                    <Typography variant="subtitle1" component="div" fontWeight="bold" >
                        Birthday
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                    {userInfo &&(
                            <>
                                {userInfo.birthday ?(
                                    <span>{moment(userInfo.birthDate).format('LL')}</span>
                                ):(
                                    <span>Undetermined</span>
                                )}
                            </>
                        )}
                    </Typography>
                </Grid>
                <Grid container direction="row" sx={styles.personalInfos} >
                    <Typography variant="subtitle1" component="div" fontWeight="bold">
                        Email
                    </Typography>
                    <Typography variant="subtitle1" component="div" >
                        {userInfo && <span>{`${userInfo.email}`}</span>}
                    </Typography>
                </Grid>
                <Grid container direction="row" sx={styles.personalInfos} >
                    <Typography variant="subtitle1" component="div" fontWeight="bold" >
                        Phone number 
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                       {userInfo && <span>{`${userInfo.phoneNumber}`}</span>}
                    </Typography>
                </Grid>

                <Grid item xs={10} sx={styles.followedChannels}>
                    <Typography variant="subtitle1" component="div" gutterBottom fontWeight="bold" >
                        Followed channels
                    </Typography>
                </Grid>
                <Divider sx={{marginRight:'160px', marginBottom:'30px'}} />
                <Channel srcImg='profile.jpg' name="chaine dial zwamel" sx={styles.followedChannelsList}/>
                <Channel srcImg='profile.jpg' name="chaine dial lqhab" sx={styles.followedChannelsList} />
                <Channel srcImg='profile.jpg' name="chaine dial zwamel 2" sx={styles.followedChannelsList} />
            </Grid>

            <Dialog
                fullWidth
                open={editInfosIsOpen}
                >
                <DialogTitle sx={{m:'0',p:'1.5vh 0.4vw' }}>
                  Edit profile
                <IconButton
                    aria-label="close"
                    onClick={()=>setEditInfosIsOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid item xs={10} >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            sx={styles.tabs}
                        >
                            <Tab value="Personal Infos" label={<Typography variant="body1">{getIcon("Personal Infos")} Personal Infos</Typography>}  iconPosition="start" sx={{textTransform:'none',fontSize:'1.5vw'}} />
                            <Tab value="change pwd" label={<Typography>{getIcon("change pwd")} Change password</Typography>} iconPosition="start"  sx={{textTransform:'none',fontSize:'1.3vw'}} />
                        </Tabs>
                        {value === 'Personal Infos' && <PersonalInfos/>}
                        {value === 'change pwd' && <ChangePwd/>}
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={()=>setEditInfosIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button autoFocus onClick={handleSavePost}>
                      Save
                    </Button>
                  </DialogActions>
              </Dialog>

              <Dialog
                fullWidth
                open={createChannelIsOpen}
                >
                <DialogTitle sx={{m:'0',p:'1.5vh 0.4vw' }}>
                  Create new channel
                <IconButton
                    aria-label="close"
                    onClick={handleCancelCreateChannel}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                <Grid container  sx={{padding:'2px'}} >
        <Grid item xs={10}>          
            <InputField  value={channelName}
                         label="Channel name"
                          placeholder="Enter channel name"
                          errorMessage={channelNameError}
                          onChange={(e)=>setChannelName(e.target.value)}
                         sx={{width:'400px'}}/>
        </Grid>
        <Grid item xs={10}>          
            <InputField  value={channelDescription}
                         multiline
                         label="Channel description"
                          placeholder="Enter channel description"
                          onChange={(e)=>setChannelDescription(e.target.value)}
                         sx={{width:'400px'}}/>
        </Grid>
        <Grid item xs={10} sx={{marginTop:'2vh'}}>
            <TagsInput 
            sx={{width:'400px'}}
            selectedTags={handleTagsList}
            variant="outlined"
            id="tags"
            name="tags"
            tags={channelTags}
            placeholder="add tag"
             label="Tags"  
            />
        </Grid>
    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleCancelCreateChannel}>
                      Cancel
                    </Button>
                    <Button autoFocus onClick={handleCreateChannel}>
                      Save
                    </Button>
                  </DialogActions>
              </Dialog>
            
        </Grid >
    );    
};

const styles = {
    profilePic : {
        width:'280px',
        height:'280px',
        paddingBottom: '14px',
        position: 'relative',
        top: 0,
        left: 0,
    },
    firstcol: {
        paddingLeft: '30px',
    },
    secondcol: {
        paddingLeft: '80px',
    },
    channelsList: {
        marginRight: '20px',
        "&:hover": {
            backgroundColor:'#ececec',
            cursor:'pointer'
        }
    },
    location: {
        marginTop: '20px',
        color: 'gray'
    },
    button: {
        marginTop: '14px',
        bgcolor:'color.main'
    },
    tabs: {
        //height:height/15,
        marginBottom: '20px',
    },
    editIcon: {
        marginTop: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline'
    },
    joinedOn: {
        marginTop: '10px',
    },
    personalInfos: {
        marginTop: '10px',
        display: 'flex',
        gap: '60px',
    },
    followedChannels: {
        marginTop: '50px'
    },
    followedChannelsList: {
        marginRight:'160px',
        "&:hover": {
            marginRight:'160px',
            backgroundColor:'#ececec',
            cursor:'pointer'
        }
    }
}

const getIcon=(type)=>{
    if(type==="Personal Infos"){
      return(
        <>
          <PersonIcon/>
        </>
      )
    }
    else if(type==="change pwd"){
      return (
        <>
          <KeyIcon/>
        </>
      )
    }  
}

export default Profile;
