const cipherTable = {
  'A': 'wordle',
  'B': 'xpsemf',
  'C': 'yqtfng',
  'D': 'zrugoh',
  'E': 'asvhpi',
  'F': 'btwiqj',
  'G': 'cuxjrk',
  'H': 'dvyksl',
  'I': 'ewzltm',
  'J': 'fxamun',
  'K': 'gybnvo',
  'L': 'hzcowp',
  'M': 'iadpxq',
  'N': 'jbeqyr',
  'O': 'kcfrzs',
  'P': 'ldgsat',
  'Q': 'mehtbu',
  'R': 'nfiucv',
  'S': 'ogjvdw',
  'T': 'phkwex',
  'U': 'qilxfy',
  'V': 'rjmygz',
  'W': 'sknzha',
  'X': 'tloaib',
  'Y': 'umpbjc',
  'Z': 'vnqckd'
};

// Features: Theme switching, character count, copy button, clear functionality
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
  }
}

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

toggleSwitch.addEventListener('change', switchTheme, false);

function clearInput(inputId, resultId) {
  document.getElementById(inputId).value = '';
  document.getElementById(resultId).textContent = '';
  if (inputId === 'wordInput') {
    document.getElementById('charCount').textContent = '0 characters';
    document.getElementById('copyBtn').style.display = 'none';
  }
}

document.getElementById('wordInput').addEventListener('input', (e) => {
  const count = e.target.value.length;
  document.getElementById('charCount').textContent = `${count} character${count !== 1 ? 's' : ''}`;
});

function decrypt(code) {
  let decryptedWord = '';
  for (let i = 0; i < code.length; i++) {
    const char = code[i].toLowerCase();
    const pos = i % 6; // Loops back after 6th letter
    
    let found = false;
    for (const [key, value] of Object.entries(cipherTable)) {
      if (value[pos] === char) {
        decryptedWord += key;
        found = true;
        break;
      }
    }
    if (!found) {
      decryptedWord += '?'; // Placeholder if char not found
    }
  }
  return decryptedWord;
}

function encrypt(word) {
  let encryptedCode = '';
  const upperWord = word.toUpperCase();
  for (let i = 0; i < upperWord.length; i++) {
    const char = upperWord[i];
    const pos = i % 6;
    
    if (cipherTable[char]) {
      encryptedCode += cipherTable[char][pos];
    } else {
      encryptedCode += '?';
    }
  }
  return encryptedCode;
}

document.getElementById('findWordBtn').addEventListener('click', () => {
  const urlString = document.getElementById('linkInput').value.trim();
  const resultDiv = document.getElementById('result');
  
  if (!urlString) {
    resultDiv.textContent = 'Please paste a link';
    resultDiv.style.color = 'red';
    return;
  }

  try {
    const url = new URL(urlString);
    const code = url.searchParams.get('word');
    
    if (code) {
      const word = decrypt(code);
      resultDiv.textContent = word;
      resultDiv.style.color = 'var(--result-color)';
    } else {
      resultDiv.textContent = 'Invalid link: "word" parameter missing';
      resultDiv.style.color = 'red';
    }
  } catch (e) {
    resultDiv.textContent = 'Invalid URL format';
    resultDiv.style.color = 'red';
  }
});

document.getElementById('generateLinkBtn').addEventListener('click', () => {
  const word = document.getElementById('wordInput').value.trim();
  const linkResultDiv = document.getElementById('linkResult');
  const copyBtn = document.getElementById('copyBtn');

  if (word) {
    const code = encrypt(word);
    const generatedUrl = `https://mywordle.strivemath.com/?word=${code}`;
    linkResultDiv.textContent = generatedUrl;
    linkResultDiv.style.color = 'var(--result-color)';
    copyBtn.style.display = 'block';
  } else {
    linkResultDiv.textContent = 'Please enter a word';
    linkResultDiv.style.color = 'red';
    copyBtn.style.display = 'none';
  }
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('linkResult').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const originalText = document.getElementById('copyBtn').textContent;
    document.getElementById('copyBtn').textContent = 'Copied!';
    setTimeout(() => {
      document.getElementById('copyBtn').textContent = originalText;
    }, 2000);
  });
});
