document.addEventListener('DOMContentLoaded', function() {
  loadSavedSets();

  //Rest timer using progressBar.js library
  var bar = new ProgressBar.Circle('#countdown-container', {
      strokeWidth: 20,
      color: '#ffffff',
      trailColor: '#aaa',
      trailWidth: 3,
      svgStyle: {
          width: '100%',
          height: '100%'
      },
      text: {
          autoStyleContainer: false
      },
      from: {
          color: '#FFEA82',
          width: 4
      },
      to: {
          color: '#ED6A5A',
          width: 4
      },
      step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
          bar.path.setAttribute('stroke-width', state.width);
          bar.setText(Math.round(bar.value() * 60));
      }
  });

  const exerciseContainers = document.querySelectorAll('.exercise-container');
  exerciseContainers.forEach(container => {
      container.addEventListener('click', function() {
          exerciseContainers.forEach(c => c.classList.remove('active'));
          this.classList.add('active');
          document.querySelectorAll('.new-set-container').forEach(c => c.style.display = 'none');
          this.querySelector('.new-set-container').style.display = 'flex';
      });
  });


  function updateExertionScale(exercise, value) {
      const scale = document.querySelector(`.exertion-scale[data-exercise="${exercise}"]`);
      scale.dataset.value = value;
      scale.querySelectorAll('.exertion-dot').forEach(dot => {
          dot.classList.toggle('selected', dot.dataset.value <= value);
      });
  }

  // Function to add a new set
  function addSet(exercise) {
      // Get form inputs
      const weightInput = document.querySelector(`.${exercise}-weight`);
      const repsInput = document.querySelector(`.${exercise}-reps`);
      const exertionScale = document.querySelector(`.exertion-scale[data-exercise="${exercise}"]`);
      const setsList = document.querySelector(`#${exercise}-sets`);
      // Validate inputs
      let weight = weightInput.value;
      let reps = repsInput.value;
      let exertionValue = exertionScale.dataset.value;

      let hasError = false;
      //Error messages for null input
      if (!weight || weight <= 0) {
          document.getElementById(`${exercise}-weight-error`).textContent = 'Please enter a valid weight.';
          document.getElementById(`${exercise}-weight-error`).style.display = 'block';
          hasError = true;
      } else {
          document.getElementById(`${exercise}-weight-error`).style.display = 'none';
      }

      if (!reps || reps <= 0 || reps > 20) {
          document.getElementById(`${exercise}-reps-error`).textContent = 'Please enter a valid number of reps (1-20).';
          document.getElementById(`${exercise}-reps-error`).style.display = 'block';
          hasError = true;
      } else {
          document.getElementById(`${exercise}-reps-error`).style.display = 'none';
      }

      if (!exertionValue || exertionValue <= 0) {
          document.getElementById(`${exercise}-exertion-error`).textContent = 'Please select an exertion level.';
          document.getElementById(`${exercise}-exertion-error`).style.display = 'block';
          hasError = true;
      } else {
          document.getElementById(`${exercise}-exertion-error`).style.display = 'none';
      }

      if (hasError) return;

      let exertionDisplay = '';
      for (let i = 1; i <= 5; i++) {
          if (i <= exertionValue) {
              exertionDisplay += '●';
          } else {
              exertionDisplay += '○';
          }
      }

      const setItem = document.createElement('li');
      setItem.className = 'set-item';
      const setNumber = setsList.children.length + 1;

      // Add input values to the set history
      setItem.innerHTML = `
  <div class="set-info">${setNumber}</div>
  <div class="set-info">${weight} lbs</div>
  <div class="set-info">${reps}</div>
  <div class="set-exertion-info">${exertionDisplay}</div>
  <button class="delete-set-btn" onclick="deleteSet('${exercise}', ${setNumber - 1})">Delete</button>
`;

      setsList.appendChild(setItem);

      //Store set history in local storage
      const setDetails = {
          setNumber,
          weight,
          reps,
          exertionValue
      };
      const storedSets = JSON.parse(localStorage.getItem(exercise) || '[]');
      storedSets.push(setDetails);
      localStorage.setItem(exercise, JSON.stringify(storedSets));

      // Reset the form fields
      weightInput.value = '';
      repsInput.value = '';
      updateExertionScale(exercise, 0);
  }

  //Event listener for the "Add Set" button
  document.querySelectorAll('.exertion-dot').forEach(dot => {
      dot.addEventListener('mouseenter', function() {
          let hoverValue = parseInt(this.dataset.value, 10);
          let dots = this.parentElement.querySelectorAll('.exertion-dot');
          dots.forEach((dot, index) => {
              if (index < hoverValue) {
                  dot.classList.add('hovered');
              }
          });
      });

      document.querySelectorAll('.exertion-dot').forEach(dot => {
          dot.addEventListener('click', function() {
              const exercise = this.closest('.exercise-container').id;
              updateExertionScale(exercise, this.dataset.value);
          });
      });

      dot.addEventListener('mouseleave', function() {
          // On mouse leave, remove ':hovered' class from all dots
          let dots = this.parentElement.querySelectorAll('.exertion-dot');
          dots.forEach(dot => {
              dot.classList.remove('hovered');
          });
      });
  });

  document.querySelectorAll('.exertion-dot').forEach(dot => {
      dot.addEventListener('click', function() {
          let selectValue = parseInt(this.dataset.value, 10);
          let dots = this.parentElement.querySelectorAll('.exertion-dot');
          dots.forEach((dot, index) => {
              dot.classList.remove('selected');
              if (index < selectValue) {
                  dot.classList.add('selected');
              }
          });
      });
  });

  document.querySelectorAll('.add-set-btn').forEach(button => {
      button.addEventListener('click', function(event) {
          const exercise = button.dataset.exercise;
          if (!exercise) {
              console.error('Data-exercise attribute not found on button');
              return;
          }
          addSet(exercise);
      });
  });

  var timerInterval;
  var timerRunning = false;
  var timerDuration = 60;
  var remainingTime = timerDuration;

  function startTimer() {
      if (!timerRunning) {
          timerRunning = true;

          bar.animate(1.0, {
              duration: remainingTime * 1000
          });

          timerInterval = setInterval(function() {
              remainingTime--;
              bar.setText(remainingTime);

              if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                  timerRunning = false;
                  bar.setText("Done");
                  remainingTime = timerDuration;
              }
          }, 1000);
      }
  }

  function pauseTimer() {
      if (timerRunning) {
          clearInterval(timerInterval);
          bar.stop();
          timerRunning = false;
      }
  }

  function resetTimer() {
      clearInterval(timerInterval);
      bar.set(0);
      bar.setText("0");
      timerRunning = false;
      remainingTime = timerDuration;
  }

  document.getElementById('start-timer').addEventListener('click', startTimer);
  document.getElementById('pause-timer').addEventListener('click', pauseTimer);
  document.getElementById('reset-timer').addEventListener('click', resetTimer);


});

function loadSavedSets() {
  const exercises = ['deadlift', 'squat', 'bench'];

  exercises.forEach(exercise => {
      const setsList = document.querySelector(`#${exercise}-sets`);
      setsList.innerHTML = '';
      const sets = JSON.parse(localStorage.getItem(exercise) || '[]');
      sets.forEach((set, index) => {
          addSetToDOM(exercise, set, index);
      });
  });
}

function addSetToDOM(exercise, setDetails, index) {
  const setsList = document.querySelector(`#${exercise}-sets`);

  let exertionDisplay = '';
  for (let i = 1; i <= 5; i++) {
      if (i <= setDetails.exertionValue) {
          exertionDisplay += '●';
      } else {
          exertionDisplay += '○';
      }
  }


  const setItem = document.createElement('li');
  setItem.className = 'set-item';
  setItem.dataset.index = index;

  setItem.innerHTML = `
  <div class="set-info">${setDetails.setNumber}</div>
  <div class="set-info">${setDetails.weight} lbs</div>
  <div class="set-info">${setDetails.reps}</div>
  <div class="set-exertion-info">${exertionDisplay}</div>
  <button class="delete-set-btn" onclick="deleteSet('${exercise}', ${index})">Delete</button>
`;


  setsList.appendChild(setItem);
}

function deleteSet(exercise, index) {
  let sets = JSON.parse(localStorage.getItem(exercise) || '[]');
  sets.splice(index, 1);
  localStorage.setItem(exercise, JSON.stringify(sets));
  loadSavedSets();
}

function createSummaryContainer(exercisesSummary) {
  const summaryContainer = document.createElement('div');
  summaryContainer.className = 'summary-container';
  let summaryHtml = `<h2>Next Workout Suggestion</h2>
               <p>Based on the progressive overload principle, here are suggested working sets for your next workout:</p>`;

  exercisesSummary.forEach(exercise => {
      summaryHtml += `<div class="summary-exercise">
                <h3>${exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}</h3>
                <p>Weight: ${exercise.suggestedWeight} lbs</p>
                <p>Reps: ${exercise.suggestedReps}</p>
              </div>`;
  });

  // Add a button to start a new workout
  summaryHtml += `<button id="start-new-workout">Start New Workout</button>`;
  summaryContainer.innerHTML = summaryHtml;

  // Add event listener to the new workout button
  summaryContainer.querySelector('#start-new-workout').addEventListener('click', function() {
      // Clear localStorage for the exercises
      ['deadlift', 'squat', 'bench'].forEach(exercise => localStorage.removeItem(exercise));

      // Reload the page to reset the state
      location.reload();
  });

  return summaryContainer;
}

document.getElementById('end-workout').addEventListener('click', function() {
  const exercises = ['deadlift', 'squat', 'bench'];
  let exercisesSummary = [];

  function roundToNearestFive(num) {
      return Math.round(num / 5) * 5;
  }

  exercises.forEach(exercise => {
      const sets = JSON.parse(localStorage.getItem(exercise) || '[]');
      let suggestedWeight = 0;
      let suggestedReps = 0;

      // Logic to calculate suggested weight and reps
      sets.forEach(set => {
          if (set && set.weight && set.exertionValue) {
              suggestedWeight = parseInt(set.weight);
              const exertionLevel = set.exertionValue * 2; // Convert to RPE scale

              if (exertionLevel >= 8) {
                  suggestedWeight *= 0.95; // Decrease weight by 5%
              } else if (exertionLevel >= 4 && exertionLevel < 8) {
                  suggestedWeight *= 1.025; // Incraese weight by 2.5%
              } else if (exertionLevel < 4) {
                  suggestedWeight *= 1.05; // Increase weight by 5%
              }
              suggestedWeight = roundToNearestFive(suggestedWeight); // Round to nearest 5
              suggestedReps = set.reps; // Adjust reps as needed
          }
      });


      if (sets.length > 0) {
          exercisesSummary.push({
              name: exercise,
              suggestedWeight,
              suggestedReps
          });
      }
  });

  // Create and display the summary container
  const mainContainer = document.getElementById('app');
  mainContainer.innerHTML = ''; // Clear existng content
  mainContainer.appendChild(createSummaryContainer(exercisesSummary));
});