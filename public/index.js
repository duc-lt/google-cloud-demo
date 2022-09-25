const downloadTabBtn = document.getElementById('download-btn');
const uploadBtn = document.getElementById('upload-btn');
const filelist = document.getElementById('files');
const filesForm = document.getElementById('files-form');
const input = document.querySelector('input[type=file][multiple]');

renderFiles();

downloadTabBtn.addEventListener('click', async (e) => {
  try {
    openTab(e, 'download-tab');
    await renderFiles();
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
    await upload();
    alert('Uploaded files succesfully');
    downloadTabBtn.click();
  } catch (error) {
    alert({ error: error?.message });
  }
});

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

async function getFiles() {
  const res = await fetch('/files');
  return res.json();
}

async function renderFiles() {
  clearFileListBeforeRendering();

  const files = await getFiles();

  for (const file of files) {
    const filename = file.name;

    const fileItem = document.createElement('li');
    fileItem.classList.add('file-item');
    fileItem.style.display = 'flex';
    fileItem.style.justifyContent = 'space-between';
    // fileItem.style.maxWidth = '500px';

    const ref = document.createElement('a');
    ref.innerText = filename;
    ref.href = `/files/download?filename=${filename}`;
    ref.target = '_blank';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      try {
        if (confirm('Are you sure you want to delete this file?')) {
          await remove(filename);
          alert(`Deleted ${filename} successfully`);
          downloadTabBtn.click();
        }
      } catch (error) {
        alert({ error: error?.message });
      }
    });

    fileItem.appendChild(ref);
    fileItem.appendChild(deleteBtn);
    filelist.appendChild(fileItem);
  }
}

async function upload() {
  const formData = new FormData();

  for (let i = 0; i < input.files.length; i++) {
    formData.append('files', input.files[i]);
  }
  fetch('/files/upload', {
    method: 'POST',
    body: formData,
  });
}

function clearFileListBeforeRendering() {
  while (filelist.hasChildNodes()) {
    filelist.removeChild(filelist.firstChild);
  }
}

async function remove(filename) {
  fetch(`files?filename=${filename}`, {
    method: 'DELETE',
  });
}
