import { useEffect, useState } from 'react';
import './Home.css';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import img from './level-1.jpg';
import firebase from '../../firebase';

const Home = () => {

    const [showOverlay, setShowOverlay] = useState({
        visible: false,
        xPosition: null,
        yPosition: null
    });

    const openTargetingBox = (state) => {
        if (state.visible === true) {
            const targetingBox = document.querySelector(".targeting-box");
            targetingBox.style.left = `${state.xPosition}px`;
            targetingBox.style.top = `${state.yPosition}px`;
            targetingBox.style.transform = "translate(-50%, -50%)";
        }
    };

    const openMenu = (state) => {
        if (state.visible === true) {
            const menuBox = document.querySelector(".menu-box");
            menuBox.style.left = `${state.xPosition}px`;
            menuBox.style.top = `${state.yPosition}px`;
            menuBox.style.transform = "translate(4rem)";
        }
    };

    useEffect(() => {
        openTargetingBox(showOverlay);
        openMenu(showOverlay);
    }, [showOverlay]);
   
    useEffect(() => {
        const levels = firebase.firestore().collection('levels').doc("level1")
        levels.get().then((doc) => {
            if (doc.exists) {
                console.log(doc.data().characters.waldo[0]);                
                console.log(doc.data().characters.waldo);
            } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
        }).catch((error) => {
        console.log("Error getting document:", error);
        });
    });

    const clickHandler = (e) => {

        const gameImage = document.querySelector(".test");

        const bounds = gameImage.getBoundingClientRect();
        const left = bounds.left;
        const top = bounds.top;
        const x = e.pageX - left;
        const y = e.pageY - top;
        const cw = gameImage.clientWidth;
        const ch = gameImage.clientHeight;
        const iw = gameImage.naturalWidth;
        const ih = gameImage.naturalHeight;
        const px = x/cw*iw;
        const py = y/ch*ih;
    
        const xLowerBoundary = px - 50;
        const xUpperBoundary = px + 50;
        const yLowerBoundary = py - 50;
        const yUpperBoundary = py + 50;

        const levels = firebase.firestore().collection('levels').doc("level1");
        levels.get().then((doc) => {
            if (doc.exists) {
                if ((((doc.data().characters.waldo[0]) > xLowerBoundary) && ((doc.data().characters.waldo[0]) < xUpperBoundary)) && (((doc.data().characters.waldo[1]) > yLowerBoundary) && ((doc.data().characters.waldo[1]) < yUpperBoundary))) {
                    console.log(doc.data().characters.waldo);
                }          
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            }).catch((error) => {
            console.log("Error getting document:", error);
            });
    };

    return (
        <Layout>
            <div className="main-container">
                <div className="main-container__grid">
                    <img 
                        src={img} 
                        className="test"
                        alt="Placeholder"
                        onClick={(e) => {
                            setShowOverlay(({
                                visible: !showOverlay.visible,
                                xPosition: e.pageX,
                                yPosition: e.pageY
                            }));
                            clickHandler(e);
                        }}>
                    </img>
                    {showOverlay.visible && <div className="targeting-box" />}
                    {/* Probably going to want a component list here for the menu with props of characters */}
                    {showOverlay.visible && <div className="menu-box" />}
                </div>
            </div>
        </Layout>
    );
}

export default Home;
