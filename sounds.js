
let button;
let synthSequence;
let drumPattern;
let explosionSoundEffect; // Declare the explosion sound variable
let explosionButton; // Button to trigger the explosion sound
let fireSoundEffect; // Declare the fire sound variable
let fireButton; // Button to trigger the fire sound
let buttonNoiseEffect;
let buttonNoiseButton;
let victorySoundEffect; // Declare the variable for the victory sound
let victoryButton; // Button to trigger the victory sound
const volume = new Tone.Volume();

function setup() {
  createCanvas(200, 200);

  // Create a button that starts the theme tune
  button = createButton('Play Theme Tune');
  button.position(50, 100);
  button.mousePressed(playThemeTune);

  // Create a button to trigger the explosion sound
  explosionButton = createButton('Explosion');
  explosionButton.position(50, 140); // Position it below the first button
  explosionButton.mousePressed(explosionSound);

  // Create a button to trigger the fire sound
  fireButton = createButton('Fire');
  fireButton.position(50, 180); // Position it below the second button
  fireButton.mousePressed(fireSound);

  buttonNoiseButton = createButton('Ding');
  buttonNoiseButton.position(50, 220); // Position it below the fire sound button
  buttonNoiseButton.mousePressed(buttonNoise);

  tankMovingButton = createButton('Tank Move');
  tankMovingButton.position(50, 260); // Position it below the button noise
  tankMovingButton.mousePressed(startTankMoving);
  tankMovingButton.mouseReleased(stopTankMoving); // Stops when button is released

  tankMovingButton = createButton('Move Tank');
  tankMovingButton.position(50, 260); // Position it below the buttonNoise button
  tankMovingButton.mousePressed(startTankMoving);
  tankMovingButton.mouseReleased(stopTankMoving); // Stop when released

  victoryButton = createButton('Victory');
  victoryButton.position(50, 300); // Position it below the tank moving button
  victoryButton.mousePressed(victorySound);

}

window.playThemeTune = function() {
  // If Tone.js is not started yet, start it
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
  

  const reverb = new Tone.Reverb({
    decay: 4,
    preDelay: 0.1,
    wet: 0.5,
  }).toDestination();

  // Create a distortion effect
  const distortion = new Tone.Distortion({
    distortion: 0.2,
    oversample: '4x',
  });

  // Create a synth for the theme tune
  const synth = new Tone.MonoSynth({
    volume: -15,
    oscillator: {
      type: 'sawtooth',
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.5,
      release: 0.2,
    },
  }).toDestination();

  synth.chain(distortion, reverb, Tone.Destination);

  const drums = new Tone.MembraneSynth({
    volume: -5,
    pitchDecay: 0.05,
    octaves: 4,
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
      attackCurve: 'exponential',
    },
   }).toDestination();

   const bass = new Tone.MonoSynth({
    volume: -10,
    oscillator: {
      type: 'triangle'
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.8,
      release: 0.6,
    }
  }).toDestination();

  // Notes for the theme tune
  const melody = [
    'C2', 'E2', 'F2', 'E2', 'D2', // First phrase
    'E2', 'F2', 'G2', 'C2', 'D2', 'E2', 'C2', 'G2', 'E2', 'D2', 'D2' // Second phrase
  ];

  const bassline = [
    'C1', 'E1', 'F1', 'E1', 'D1', 'E1', 'F1', 'G1', 'C1', 'D1', 'E1', 'C1', 'G1', 'E1', 'D1', 'D1'
  ];

  synthSequence = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, '8n', time);
  }, melody, '4n'); 

  const bassSequence = new Tone.Sequence((time, note) => {
    bass.triggerAttackRelease(note, '8n', time);
  }, bassline, '4n');

  const drumPattern = new Tone.Loop((time) => {
    drums.triggerAttackRelease('C2', '16n', time, 0.5); // Adding a kick on C2 with half velocity
    if (Tone.Transport.seconds % 2 === 0) {
      drums.triggerAttackRelease('A1', '16n', time + 0.5); // Adding a snare on off beats
    }
  }, '4n');

  synthSequence.start(0);
  bassSequence.start(0);
  drumPattern.start(0);

  Tone.Transport.bpm.value = 120; 
  Tone.Transport.start();
};

window.stopTheme = function() {
  if (synthSequence) {
    synthSequence.stop();
  }

  if (drumPattern) {
    drumPattern.stop();
  }

  Tone.Transport.stop();
};






window.explosionSound = function() {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
  const volume = new Tone.Volume(10);

  const reverb = new Tone.Reverb({
    decay: 18,
    preDelay: 0.1,
    wet: 0.95,
  }).toDestination();

  // Use distortion to add crunch and impact
  const distortion = new Tone.Distortion({
    distortion: 0.4, // High distortion for grittier sound
    oversample: '4x', // Reduces aliasing artifacts
  });

  const noise = new Tone.Noise("pink") // Use white noise for the explosion
  const filter = new Tone.Filter({
    type: 'lowpass', // Lowpass filter to simulate muffling as it dissipates
    frequency: 300, // Starting frequency
    rolloff: -12, // Steeper rolloff for a more dramatic effect
    Q: 10,
  });

  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.02, // Quick onset for an explosive start
    decay: 0.6, // Long decay for a drawn-out effect
    sustain: 0.1, // No sustain to maintain dramatic impact
    release: 0.3, // Short release to fade out quickly
  });

  feedbackDelay = new Tone.FeedbackDelay({
    delayTime: 0.2, 
    feedback: 0.4,
  });

  // Connect noise through envelope and filter, then to destination
  noise.chain(envelope, filter, feedbackDelay, reverb, distortion, volume, Tone.Destination);

  // Start noise with an envelope trigger
  envelope.triggerAttackRelease(.5); // Duration of the envelope
  noise.start(); // Start the noise generator
};

window.fireSound = function() {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
  const volume = new Tone.Volume(10);

  const reverb = new Tone.Reverb({
    decay: 4,
    preDelay: 0.1,
    wet: 0.8,
  }).toDestination();

  const distortion = new Tone.Distortion({
    distortion: 0.7, 
    oversample: '4x',
  });

  const noise = new Tone.Noise("white"); // Use white noise for sharper gunshot sound

  const filter = new Tone.Filter({
    type: 'lowpass', 
    frequency: 300, 
    rolloff: -12, 
    Q: 3, 
  });

  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.005, 
    decay: 0.1, 
    sustain: 0, 
    release: 0.1,
  });

  noise.chain(envelope, filter, distortion, reverb, volume, Tone.Destination);

  envelope.triggerAttackRelease(0.2); 
  noise.start();
};

window.buttonNoise = function () {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }

  const volume = new Tone.Volume(-5); // No additional gain or reduction

  const reverb = new Tone.Reverb({
    decay: 1, // Short decay for a quick reverb tail
    preDelay: 0.1,
    wet: 0.5, // Moderate reverb wetness
  });

  // Create a simple synth with a sine wave oscillator
  const synth = new Tone.Synth({
    oscillator: {
      type: 'sine', // Sine wave for a smooth, bell-like sound
    },
    envelope: {
      attack: 0.005, // Very quick attack for an immediate sound
      decay: 0.1, // Short decay to keep the sound brief
      sustain: 0, // No sustain for a clean ding
      release: 0.2, // Short release to fade out quickly
    },
  });

  // Connect the synth through reverb and volume control to the destination
  synth.chain(reverb, volume, Tone.Destination);

  // Trigger a quick note to create a ding sound
  synth.triggerAttackRelease('C5', 0.1); // Play a high-pitched note for a short time
};

window.victorySound = function () {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
const volume = new Tone.Volume(-50);
  const reverb = new Tone.Reverb({
    decay: 8, // Longer decay for a broader sound
    preDelay: 0.1,
    wet: 0.7, // Higher wetness for a more open sound
  }).toDestination();

  const distortion = new Tone.Distortion({
    distortion: 0.2, // Light distortion for extra edge
    oversample: '4x',
  });

  const synth = new Tone.MonoSynth({
    oscillator: {
      type: 'sawtooth', // Sawtooth for a retro vibe
      frequency: 200
    },
    
    envelope: {
      attack: 0.1, // Slight delay to soften the onset
      decay: 0.3, // Longer decay for dramatic release
      sustain: 0.5, // Maintain some sustain
      release: 0.5, // Moderate release to let the sound fade out slowly
    },
  }).chain(distortion, reverb, volume, Tone.Destination);

  const victoryMelody = [
    { time: '0:0', note: 'C2', duration: '8n' },
    { time: '0:1', note: 'E2', duration: '8n' },
    { time: '0:2', note: 'G2', duration: '8n' },
    { time: '0:3', note: 'C3', duration: '8n' },
    { time: '0:4', note: 'E3', duration: '8n' },
    { time: '0:5', note: 'G3', duration: '8n' },
    { time: '1:0', note: 'C3', duration: '4n' }, // Longer climax note
    { time: '1:2', note: 'F3', duration: '8n' },
    { time: '1:3', note: 'E3', duration: '8n' },
    { time: '1:4', note: 'C3', duration: '8n' },
    { time: '1:5', note: 'G2', duration: '8n' },
    { time: '2:0', note: 'E2', duration: '8n' },
    { time: '2:1', note: 'C2', duration: '1n' }, // Resolving note
  ];
  
  

  // Ensure Transport is stopped and reset before starting again
  if (Tone.Transport.state === 'started') {
    Tone.Transport.stop(); // Stop the Transport
  }
  Tone.Transport.position = 0; // Reset the position to ensure a clean start

  const victoryPart = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(value.note, value.duration, time);
  }, victoryMelody);

  victoryPart.loop = 0; // Ensure it plays only once per activation
  victoryPart.start(0); // Start immediately

  // Start the Transport to play the sequence
  Tone.Transport.start("+0.1"); // Slight delay to ensure smooth start
};

window.welcomeTheme = function () {
    if (Tone.context.state !== 'running') {
      Tone.start();
    }
    const volume = new Tone.Volume();
    const reverb = new Tone.Reverb({
      decay: 2,
      preDelay: 0.1,
      wet: 0.3, // Moderate reverb for some room feel
    }).toDestination();
  
    // Create drum synths for kick, snare, and hi-hat
    const kick = new Tone.MembraneSynth({
      volume: -10,
      pitchDecay: 0.6,
      octaves: 2,
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.005,
        decay: 0.5,
        sustain: 0.1,
        release: 0.3,
      },
    }).toDestination();
  
    const snare = new Tone.NoiseSynth({
      volume: -15,
      noise: {
        type: "white",
      },
      envelope: {
        attack: 0.005,
        decay: 0.6,
        sustain: 0,
        release: 0.3,
      },
    }).toDestination();
  
    const hiHat = new Tone.MetalSynth({
      volume: -15,
      frequency: 200,
      envelope: {
        attack: 0.005,
        decay: 0.15,
        release: 0.3,
      },
      harmonicity: 12,
    }).toDestination();
  
    // Define the drum pattern with kick, snare, and hi-hat
    const drumPattern = new Tone.Sequence(
      (time, note) => {
        switch (note) {
          case "kick":
            kick.triggerAttackRelease("C1", "8n", time);
            break;
          case "snare":
            snare.triggerAttackRelease("8n", time);
            break;
          case "hiHat":
            hiHat.triggerAttackRelease("8n", time);
            break;
        }
      },
      ["kick", "hiHat", "snare", "hiHat"], // Simple pattern: kick-hiHat-snare-hiHat
      "8n" // Four quarter notes in each beat
    );
    Tone.Transport.bpm.value = 120; 
    drumPattern.start(0); // Start the loop
    Tone.Transport.start(); // Start the transport if not already running
  };
  
  // Function to stop the welcome theme
  window.stopWelcomeTheme = function () {
    if (synthSequence) {
      synthSequence.stop();
    }
  
    if (drumPattern) {
      drumPattern.stop();
    }
  
    Tone.Transport.stop();
  };


