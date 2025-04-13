import React from "react";
import { useSpring, animated } from "react-spring";
import './card.css'

const trans = (x, y, s) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const calc = (x, y) => {
    const BUFFER = 50;

    const why = -(y - window.innerHeight / 2) / BUFFER;
    const ex = (x - window.innerWidth / 2) / BUFFER;

    console.log("why", why);
    console.log("y", y);
    return [-(y / 50), x / 50, 1.1];
};

export default function Card3() {
    const [props, set] = useSpring(() => ({
        xys: [0, 0, 1],
        config: { mass: 5, tension: 350, friction: 40 }
    }));

    return (
        <div className="App">
            <animated.div
                className="card"
                onMouseMove={e => {
                    const { clientX: x, clientY: y } = e;

                    return set({ xys: calc(x, y) });
                }}
                onMouseLeave={() => set({ xys: [0, 0, 1] })}
                style={{ transform: props.xys.interpolate(trans) }}
            >

                <p>Nurman</p>
            </animated.div>
        </div>
    );
}
