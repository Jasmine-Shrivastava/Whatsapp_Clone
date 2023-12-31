import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import PhotoPicker from "./PhotoPicker";
import ContextMenu from "./ContextMenu";
import CapturePhoto from "./CapturePhoto";

function Avatar({type, image, setImage}) {
  const [hover,setHover] = useState(false);
  const [isContextMenuVisible,setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates,setContextMenuCoordinates] = useState({
    x: 0,
    y: 0
  });
  const [grabPhoto,setGrabPhoto] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto]= useState(false);
  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCoordinates({x: e.pageX, y: e.pageY});
    setIsContextMenuVisible(true); 
  };
  useEffect(()=> {
    if(grabPhoto){
      const data=document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) =>{
        setTimeout(() => {
          setGrabPhoto(false);
        },1000); 
      };
    }
  }, [grabPhoto]);
  const contextMenuOptions = [
    {name: "Click a Picture", callback:() => {
      setShowCapturePhoto(true);
    } },
    // {name: "From Library", callback:() => {} },
    {name: "Upload", callback:() => {
       setGrabPhoto(true);
    } },
    {name: "Remove", callback:() => {
      setImage("/default_avatar.png");
    } },
  ];

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data  = document.createElement("img");
    reader.onload=function(event) {
      data.src= event.target.result;
      data.setAttribute("data-src",event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(()=> {
      setImage(data.src);
    }, 100);
  };
  return (
  <>
  <div className="flex items-center justify-center">
    
      {type === "sm" && (
        <div className="relative h-10 w-10">
      <Image src={image} alt="avatar" className="rounded-full" fill/>
      </div>
      )}
      
      {type === "lg" && (
        <div className="relative h-14 w-14">
      <Image src={image} alt="avatar" className="rounded-full" fill/>
      </div>
      )}

{type === "xl" && (
  <div className="relative cursor-pointer z-10"
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  >
    <div
      style={{ display: hover ? 'block' : 'none' }}
      className="z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex flex-col justify-center items-center gap-2"
      onClick={e=>showContextMenu(e)}
      id="context-opener"
    >
      <FaCamera className="text-2xl" id="context-opener" onClick={e=>showContextMenu(e)}/>
      <span onClick={e=>showContextMenu(e) } id="context-opener">Change Profile Photo</span>
    </div>
    <div className="relative h-60 w-60">
      <Image src={image} alt="avatar" className="rounded-full" fill />
    </div>
  </div>
)}
</div>

{
  isContextMenuVisible && (
  <ContextMenu
  options= {contextMenuOptions}
  coordinates={contextMenuCoordinates}
  contextMenu={isContextMenuVisible}
  setContextMenu={setIsContextMenuVisible}
  />
)}
{
  showCapturePhoto && (<CapturePhoto
  setImage={setImage}
  hide = {setShowCapturePhoto}/>
)}
{grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
</>
    )
}

export default Avatar;
