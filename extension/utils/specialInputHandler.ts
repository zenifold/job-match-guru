export function handleSpecialInputs(data: any) {
  handleRadioButtons(data);
  handleCheckboxes(data);
}

function handleRadioButtons(data: any) {
  const radioGroups = document.querySelectorAll('input[type="radio"]');
  radioGroups.forEach(radio => {
    const name = radio.getAttribute('name')?.toLowerCase();
    if (!name) return;
    
    if (name.includes('visa') || name.includes('work')) {
      const value = radio.value.toLowerCase();
      if (value.includes(data.personalInfo?.visaStatus?.toLowerCase())) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });
}

function handleCheckboxes(data: any) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const label = checkbox.parentElement?.textContent?.toLowerCase();
    if (!label) return;
    
    if (data.skills?.some((skill: string) => label.includes(skill.toLowerCase()))) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}