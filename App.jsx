import React, { useEffect } from 'react';
import Beams from './Beams';

function App() {
  useEffect(() => {
    const animateTextElements = (selector, splitBy) => {
      const textContainers = document.querySelectorAll(selector);

      textContainers.forEach((textContainer) => {
        let elements = [];
        let elementType = "";

        if (splitBy === "words") {
          elements = textContainer.textContent.trim().split(/\s+/);
          elementType = "word";
        } else if (splitBy === "letters") {
          const words = textContainer.textContent.trim().split(/\s+/);
          elements = [];

          words.forEach((word, wordIndex) => {
            for (let i = 0; i < word.length; i++) {
              elements.push(word[i]);
            }

            if (wordIndex < words.length - 1) {
              elements.push(" ");
            }
          });

          elementType = "letter";
        }

        textContainer.textContent = "";

        const animatedElements = [];

        elements.forEach((element, index) => {
          if (splitBy === "letters" && element === " ") {
            textContainer.appendChild(document.createTextNode(" "));
            return;
          }

          const elementSpan = document.createElement("span");
          elementSpan.classList.add(elementType);
          elementSpan.textContent = element;
          textContainer.appendChild(elementSpan);

          if (splitBy === "words" && index < elements.length - 1) {
            textContainer.appendChild(document.createTextNode(" "));
          }

          animatedElements.push({
            element: elementSpan,
            originalX: 0,
            originalY: 0,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
          });
        });

        setTimeout(() => {
          animatedElements.forEach((element) => {
            const rect = element.element.getBoundingClientRect();
            element.originalX = rect.left + rect.width / 2;
            element.originalY = rect.top + rect.height / 2;
            element.currentX = 0;
            element.currentY = 0;
            element.targetX = 0;
            element.targetY = 0;
          });
        }, 100);

        const onMouseMove = (e) => {
          const mouseX = e.clientX;
          const mouseY = e.clientY;

          const radius = 150;
          const maxDisplacement = 300;

          animatedElements.forEach((element) => {
            const originalX = element.originalX;
            const originalY = element.originalY;

            const dx = originalX - mouseX;
            const dy = originalY - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
              const force = (1 - distance / radius) * maxDisplacement;

              element.targetX = (dx / distance) * force;
              element.targetY = (dy / distance) * force;
            } else {
              element.targetX = 0;
              element.targetY = 0;
            }
          });
        };

        document.addEventListener("mousemove", onMouseMove);

        let animationFrameId;
        const animate = () => {
          const lerpFactor = 0.1;

          animatedElements.forEach((element) => {
            element.currentX += (element.targetX - element.currentX) * lerpFactor;
            element.currentY += (element.targetY - element.currentY) * lerpFactor;

            element.element.style.transform = `translate(${element.currentX}px, ${element.currentY}px)`;
          });

          animationFrameId = requestAnimationFrame(animate);
        };

        animate();
      });
    };

    animateTextElements(".anime-text", "words");
    animateTextElements(".anime-header", "letters");

  }, []);

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: '#000' }}>
        <Beams 
          beamWidth={2}
          beamHeight={40}
          beamNumber={40}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={1.2}
          scale={0.2}
          rotation={0}
        />
      </div>

      <header className="site-header" style={{ opacity: 0.6, fontSize: '0.9em' }}>
        <div>SYNERGY QUANTUM</div>
      </header>

      <div className="container">
        <h1 className="anime-header">SYNERGY</h1>

        <p className="anime-text" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.05em' }}>
          Welcome to the absolute pinnacle of digital abstraction. We merge cutting-edge quantum architecture with seamless visual fidelity to create experiences that transcend the traditional viewport. Delve into a meticulously engineered void where every pixel serves a higher purpose.
        </p>

        <h1 className="anime-header">QUANTUM</h1>
      </div>

      <footer className="site-footer" style={{ opacity: 0.4, fontSize: '0.85em' }}>
        <div>© 2026 Y7XIFIED. ALL SYSTEMS NOMINAL.</div>
      </footer>
    </>
  );
}

export default App;
