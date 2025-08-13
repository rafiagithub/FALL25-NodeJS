# Complete Setup and Basics of Git

This guide will walk you through the complete setup process of Git and cover the basics you need to start using Git for version control.

---

## **1. What is Git?**
Git is a distributed version control system that allows developers to track changes in their codebases, collaborate with others, and manage multiple versions of their projects efficiently.

---

## **2. Installing Git**

### **For Windows:**
1. Download Git for Windows from [Git's official website](https://git-scm.com/).
2. Run the downloaded installer.
3. During installation:
   - Choose a text editor (default is Vim, but you can choose others like VS Code or Notepad++).
   - Configure the PATH environment to include Git.
   - Select HTTPS transport backend (OpenSSL is recommended).
   - Configure line-ending conversions (choose, e.g., "Checkout Windows-style, commit Unix-style line endings").
4. Finish installation and verify by opening `Git Bash` or `Command Prompt` and running:
   ```bash
   git --version
   ```

### **For macOS:**
1. Open Terminal and type:
   ```bash
   git --version
   ```
   If Git is not installed, macOS will prompt you to install Xcode Command Line Tools. Follow the on-screen instructions.

2. Alternatively, you can install Git using Homebrew:
   ```bash
   brew install git
   ```

### **For Linux:**
Use your package manager to install Git:
- **Ubuntu/Debian:**
  ```bash
  sudo apt update
  sudo apt install git
  ```
- **Fedora:**
  ```bash
  sudo dnf install git
  ```
- **Arch Linux:**
  ```bash
  sudo pacman -S git
  ```

Verify installation by running:
```bash
git --version
```

---

## **3. Configuring Git**

Before using Git, you must configure your username and email (used for commits).

1. Open a terminal or Git Bash and run:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. To verify your configuration:
   ```bash
   git config --list
   ```

3. Optional configurations:
   - Set your default text editor:
     ```bash
     git config --global core.editor "code --wait" # For VS Code
     ```
   - Enable colored output:
     ```bash
     git config --global color.ui auto
     ```

---

## **4. Setting up GitHub with SSH (Optional)**

1. **Generate SSH Key:**
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
   ```
   Press `Enter` to accept the default file location and set a passphrase if desired.

2. **Add SSH Key to SSH Agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_rsa
   ```

3. **Copy SSH Key to GitHub:**
   - Copy the public key:
     ```bash
     cat ~/.ssh/id_rsa.pub
     ```
   - Go to your GitHub account > Settings > SSH and GPG keys > New SSH key.
   - Paste the key and save.

4. **Test SSH Connection:**
   ```bash
   ssh -T git@github.com
   ```

---

## **5. Initializing a Git Repository**

1. **Create a new project folder:**
   ```bash
   mkdir my-project
   cd my-project
   ```

2. **Initialize Git in the folder:**
   ```bash
   git init
   ```

3. **Check repository status:**
   ```bash
   git status
   ```

---

## **6. Basic Git Commands**

### **Adding Files to Staging Area:**
```bash
git add <filename>       # Add a specific file
git add .                # Add all files in the current directory
```

### **Committing Changes:**
```bash
git commit -m "Your commit message"
```

### **Viewing Commit History:**
```bash
git log
```

### **Creating and Switching Branches:**
- Create a new branch:
  ```bash
  git branch <branch-name>
  ```
- Switch to the branch:
  ```bash
  git checkout <branch-name>
  ```
- Create and switch in one step:
  ```bash
  git checkout -b <branch-name>
  ```

### **Merging Branches:**
1. Switch to the branch you want to merge into (usually `main`):
   ```bash
   git checkout main
   ```
2. Merge the branch:
   ```bash
   git merge <branch-name>
   ```

### **Pushing Changes to Remote Repository:**
1. Link your local repository to a remote:
   ```bash
   git remote add origin <repository-url>
   ```
2. Push changes:
   ```bash
   git push -u origin main
   ```

### **Cloning a Repository:**
```bash
git clone <repository-url>
```

---

## **7. Undoing Changes**

### **Unstaging Files:**
```bash
git reset <filename>
```

### **Discard Local Changes:**
```bash
git checkout -- <filename>
```

### **Amending the Last Commit:**
```bash
git commit --amend -m "Updated commit message"
```

---

## **8. Pulling Changes from Remote Repository**
```bash
git pull origin main
```

---

## **9. Working with .gitignore**

Create a `.gitignore` file in your repository to exclude files/folders from being tracked by Git.

Example `.gitignore`:
```
node_modules/
*.log
.env
```

---

## **10. Helpful Tips**

- Use `git status` frequently to check your repository status.
- Use `git diff` to see changes in your working directory.
- Use `git stash` to temporarily save changes without committing them.

---

You are now ready to use Git for version control! 🎉
