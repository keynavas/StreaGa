import { Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Typography, Divider, Avatar, Paper } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React,{useRef,useEffect,useState} from 'react';
import { hideScrollBar } from '../utils/Style';
import VideoList from './VideoList';
import useWindowDimensions from '../utils/useWindowDimensions';

const Videos = () => {
    
  const {height}=useWindowDimensions();
    const images = ["eye.webp","eye.webp","eye.webp","eye.webp","eye.webp","eye.webp","eye.webp","eye.webp","eye.webp","eye.webp"];
    const listRef=useRef(null);
    const [videoList, setVideoList]=useState([{id:'',src:'/eye.webp',poster:'eye.webp',isLive:true,title:'this is a title',channelId:'2',channelName:'channel', channelProfile:'/eye.webp',views:2,time:"121150",createdAt:'2022-01-01 00:00:00'},
                                              {id:'',src:'/eye.webp',poster:'eye.webp', isLive:false,title:'this is a title this is a title this is a title this is a title this is a title title',channelId:'2',channelName:'channel' ,channelProfile:'/eye.webp',views:7854122,time:"1250", createdAt:'2022-01-01 00:00:00'},
                                              {id:'',src:'/eye.webp',poster:'eye.webp',isLive:true,title:'this is a title this is a title this is a title ',channelId:'1',channelName:'channel', channelProfile:'/eye.webp',views:2,time:"150", createdAt:'202-01-01 00:00:00'},
                                              {id:'',src:'/eye.webp',poster:'eye.webp',isLive:false,title:'this is a title this is a title this is a title this',channelId:'2',channelName:'channel', channelProfile:'/eye.webp',views:2,time:"1477250", createdAt:'2022-04-01 12:00:00'},
                                              {id:'',src:'/eye.webp',poster:'eye.webp',isLive:false,title:'this is a title this is',channelId:'2',channelName:'channel', channelProfile:'/eye.webp', views:11112,time:"650", createdAt:'2020-01-01 00:00:00'},
                                              {id:'',src:'/eye.webp',poster:'eye.webp',isLive:true,title:'title',channelId:'3',channelName:'channel', channelProfile:'/eye.webp', views:20,time:"10", createdAt:'2020-01-01 00:00:00'},
                                              {id:'',src:'/eye.webp',poster:'eye.webp', isLive:false,title:'this is a title this is a title this is a title this is',channelId:'4',channelName:'channel', channelProfile:'/eye.webp',views:2,time:"11250", createdAt:'2020-01-01 00:00:00'},
                                              {id:'',src:'/eye.webp',poster:'eye.webp',isLive:true,title:'this is a title this is a title this is a title',channelId:'4',channelName:'channel', channelProfile:'/eye.webp',views:4552,time:"0", createdAt:'2020-01-01 00:00:00'}
                                            ]);
   // const [listTitle, setListTitle]=useState('Videos from followed channels');

    
    return (
        <Grid sx={{maxHeight:height-height/7, overflow:'auto',...hideScrollBar}}>
        <VideoList videoList={videoList} listTitle={"Videos from followed channels"}/>
        <VideoList videoList={videoList} listTitle={"chi haja kayn hna"}/>
        <VideoList videoList={videoList} listTitle={"chi haja kayn hna 2"}/>
        <VideoList videoList={videoList} listTitle={"chi haja kayn hna 3"}/>
        <VideoList videoList={videoList} listTitle={"chi haja kayn hna 4"}/>
        <VideoList videoList={videoList} listTitle={"chi haja kayn hna 5"}/>

</Grid>
)}

export default Videos;

           