const downloadTabBtn = document.getElementById('download-btn');
const uploadBtn = document.getElementById('upload-btn');
const filelist = document.getElementById('files');
const filesForm = document.getElementById('files-form');
const input = document.querySelector('input[type=file][multiple]');
const header = document.getElementById('header');

(async () => {
  await renderFileArea();
})();

downloadTabBtn.addEventListener('click', async (e) => {
  try {
    openTab(e, 'download-tab');
    await renderFileArea();
  } catch (error) {
    alert({ error: error?.message });
  }
});

uploadBtn.addEventListener('click', (e) => {
  openTab(e, 'upload-tab');
  input.value = '';
});

filesForm.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const res = await upload();
    console.log(res);
    if (Array.isArray(res) && res.length > 0) {
      alert('Uploaded files succesfully');
    } else {
      alert('An error occured');
    }
    downloadTabBtn.click();
  } catch (error) {
    alert({ error: error?.message });
  }
});

// HTML rendering
function openTab(e, tabName) {
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName('tab-content');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  tablinks = document.getElementsByClassName('tablink');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  document.getElementById(tabName).style.display = 'block';
  e.currentTarget.className += ' active';
}

async function renderFileArea() {
  clearFileListBeforeRendering();
  const files = await getFiles();
  renderFiles(files);
}

function clearFileListBeforeRendering() {
  while (filelist.hasChildNodes()) {
    filelist.removeChild(filelist.firstChild);
  }

  const deleteMultiple = document.getElementById('delete-multiple');
  if (deleteMultiple) {
    deleteMultiple.remove();
  }
}

function renderDeleteMultipleArea() {
  if (filelist) {
    const deleteMultiple = document.createElement('div');
    deleteMultiple.id = 'delete-multiple';
    deleteMultiple.style.display = 'flex';
    deleteMultiple.style.justifyContent = 'space-between';
  
    const deleteAllCheckbox = document.createElement('input');
    deleteAllCheckbox.setAttribute('type', 'checkbox');
    deleteAllCheckbox.addEventListener('change', () => {
      const deleteCheckboxes = document.querySelectorAll('.delete-checkbox');
      for (const cb of deleteCheckboxes) {
        cb.checked = !cb.checked;
      }
  
      const deleteMultipleBtn = document.getElementById('delete-multiple-btn');
      deleteMultipleBtn.disabled = !deleteMultipleBtn.disabled;
    });
  
    const deleteMultipleBtn = document.createElement('button');
    deleteMultipleBtn.innerText = 'Delete selected';
    deleteMultipleBtn.disabled = true;
    deleteMultipleBtn.id = 'delete-multiple-btn';
    deleteMultipleBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete these files?')) {
        try {
          const deleteCheckboxes = document.querySelectorAll('.delete-checkbox');
          const deleteCheckboxesChecked = [...deleteCheckboxes].filter((cb) => cb.checked);
          const toBeRemoved = deleteCheckboxesChecked.map((cb) => {
            return cb.nextSibling.textContent;
          });
  
          const removeCount = toBeRemoved.length;
          
          const res = await removeMultiple(toBeRemoved);
          if (res && res.success === true) {
            alert(`Deleted ${removeCount} ${removeCount > 1 ? 'files' : 'file'} successfully`);
          } else {
            alert('An error occured');
          }
          downloadTabBtn.click();
        } catch (error) {
          alert({ error: error?.message });
        }
      }
    });
  
    deleteMultiple.appendChild(deleteAllCheckbox);
    deleteMultiple.appendChild(deleteMultipleBtn);
    filelist.parentNode.insertBefore(deleteMultiple, filelist);
  }
}

function renderFiles(files) {
  if (Array.isArray(files) && files.length > 0) {
    renderDeleteMultipleArea();
  
    for (const file of files) {
      const filename = file.name;
  
      const fileItem = document.createElement('li');
      fileItem.classList.add('file-item');
      fileItem.style.display = 'flex';
      fileItem.style.justifyContent = 'space-between';
  
      const deleteCheckbox = document.createElement('input');
      deleteCheckbox.setAttribute('type', 'checkbox');
      deleteCheckbox.classList.add('delete-checkbox');
      deleteCheckbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('input[type=checkbox]');
        const deleteMultipleBtn = document.getElementById('delete-multiple-btn');
        deleteMultipleBtn.disabled = ![...checkboxes].some((cb) => cb.checked);
      })
  
      const ref = document.createElement('a');
      ref.innerText = filename;
      ref.href = `/files/download?filename=${filename}`;
      ref.target = '_blank';
  
      const deleteBtn = document.createElement('button');
      deleteBtn.innerText = 'Delete';
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this file?')) {
          try {
            const res = await removeSingle(filename);
            if (res.success === true) {
              alert('Deleted 1 file successfully');
            } else {
              alert('An error occured');
            }
            downloadTabBtn.click();
          } catch (error) {
            alert({ error: error?.message });
          }
        }
      });
  
      fileItem.appendChild(deleteCheckbox);
      fileItem.appendChild(ref);
      fileItem.appendChild(deleteBtn);
      filelist.appendChild(fileItem);
    }
  }
}

// API calls
async function getFiles() {
  const res = await fetch('/files');
  return res.json();
}

async function upload() {
  const formData = new FormData();

  for (let i = 0; i < input.files.length; i++) {
    formData.append('files', input.files[i]);
  }
  const res = await fetch('/files/upload', {
    method: 'POST',
    body: formData,
  });

  return res.json();
}

async function removeSingle(filename) {
  const res = await fetch(`files/single?filename=${filename}`, {
    method: 'DELETE',
  });

  return res.json();
}

async function removeMultiple(filenames) {
  const query = filenames.reduce((previousQuery, filename, index) => {
    const newQuery = `${previousQuery}filename=${filename}`;
    return index !== filenames.length - 1 ? `${newQuery}&` : newQuery;
  }, '');

  const res = await fetch(`files/multiple?${query}`, {
    method: 'DELETE',
  });

  return res.json();
}
