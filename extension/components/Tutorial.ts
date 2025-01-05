export function showTutorial() {
  const tutorialSteps = [
    {
      element: '#analyze',
      content: 'Click here to analyze the job description and optimize your resume'
    },
    {
      element: '#autofill',
      content: 'Once analysis is complete, click here to automatically fill out the application'
    }
  ];

  document.getElementById('tutorial-overlay')!.innerHTML = `
    <div class="fixed inset-0 bg-black/50 z-50">
      <div class="bg-white p-4 rounded-lg max-w-sm mx-auto mt-20">
        <h3 class="font-semibold mb-2">Welcome to Resume Autofill!</h3>
        <p class="text-sm text-gray-600 mb-4">Let's get you started with a quick tour.</p>
        <div id="tutorial-content"></div>
        <button id="tutorial-next" class="button mt-4">Next</button>
      </div>
    </div>
  `;

  let currentStep = 0;
  showTutorialStep(currentStep);

  document.getElementById('tutorial-next')!.addEventListener('click', () => {
    currentStep++;
    if (currentStep < tutorialSteps.length) {
      showTutorialStep(currentStep);
    } else {
      document.getElementById('tutorial-overlay')!.innerHTML = '';
    }
  });

  function showTutorialStep(step: number) {
    const tutorialContent = document.getElementById('tutorial-content')!;
    tutorialContent.textContent = tutorialSteps[step].content;
    
    // Highlight the relevant element
    const element = document.querySelector(tutorialSteps[step].element);
    if (element) {
      element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
    }
  }
}