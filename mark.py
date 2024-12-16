import os

def get_tree_structure() -> str:
    def tree_structure(root_dir, prefix='', ignore_dirs=None):
        # Include both 'venv' and '.venv' along with other directories to ignore
        ignore_dirs = ignore_dirs or ['.git', '__pycache__', '.venv', 'venv', '.cache', '.bin', 'node_modules', 'bin', 'cache']
        items = sorted(os.listdir(root_dir))
        
        # Filter out ignored directories
        filtered_items = [
            item for item in items
            if not (os.path.isdir(os.path.join(root_dir, item)) and item.lower() in [d.lower() for d in ignore_dirs])
        ]
        
        tree = []
        for index, item in enumerate(filtered_items):
            path = os.path.join(root_dir, item)
            is_last = index == len(filtered_items) - 1
            connector = '└── ' if is_last else '├── '
            tree.append(f'{prefix}{connector}{item}')
            if os.path.isdir(path):
                extension = '    ' if is_last else '│   '
                subtree = tree_structure(path, prefix + extension, ignore_dirs)
                tree.extend(subtree)
        return tree

    def format_tree_markdown(tree):
        return '```markdown\n' + '\n'.join(tree) + '\n```'

    root_directory = '.'
    output_tree = tree_structure(root_directory)
    markdown_tree_output = format_tree_markdown(output_tree)
    return markdown_tree_output

def find_relevant_files(directory, extensions=None):
    """
    Finds files with specified extensions within a directory, recursively.

    :param directory: The root directory to search.
    :param extensions: A tuple of file extensions to include (e.g., ('.py', '.js')).
                       If None, defaults to ('.py',).
    :return: List of file paths matching the extensions.
    """
    if extensions is None:
        extensions = ('.py',)
    relevant_files = []
    for root, dirs, files in os.walk(directory):
        # Modify dirs in-place to skip ignored directories during os.walk
        dirs[:] = [d for d in dirs if d.lower() not in ['.git', '__pycache__', '.venv', 'venv', '.cache', '.bin', 'node_modules', 'bin', 'cache']]
        for file in files:
            if file.endswith(extensions):
                relevant_files.append(os.path.join(root, file))
    return relevant_files

def module_to_markdown(paths=None, output_path=None, extensions=None):
    """
    Reads modules from specified directories and writes their content into a Markdown file with code formatting.

    :param paths: List of paths to directories or files or a single path.
    :param output_path: Path to the output Markdown (.md) file.
    :param extensions: Tuple of file extensions to include (e.g., ('.py', '.js')).
    """
    if paths is None:
        # Default path
        paths = ['src']
    if output_path is None:
        output_path = 'module_code.md'
    if extensions is None:
        # Default to TypeScript and related files
        extensions = ('.tsx',)

    if isinstance(paths, str):
        paths = [paths]

    # Clear the contents of the output file before writing
    with open(output_path, 'w', encoding='utf-8') as md_file:
        md_file.write('')  # This will clear the file

    # Now append the header and other content to the empty file
    with open(output_path, 'a', encoding='utf-8') as md_file:
        md_file.write('-----------------------------------\n')
        text = f"""
# Project Overview

---

# VoiceScribeApp Design Document

## 1. Introduction
This document details the architecture and implementation of **VoiceScribeApp**, a web-based voice transcription service. The application utilizes **Supabase** for backend services and integrates with **Outlook** meetings, focusing on scalability and maintainability.

## 2. Project Overview
**VoiceScribeApp** provides:
- **Transcription**: Real-time transcription using the Deepgram API.
- **Summarization**: Summarized text generated via an LLM.
- **Outlook Integration**: Linking transcriptions with Outlook meetings using `win32com`.
- **Real-time Updates**: Leveraging Supabase’s real-time capabilities.
- **Serverless Functions**: Backend logic using Supabase Edge Functions.

## 3. System Architecture
### 3.1. Components Overview
- **Frontend**: Built with React, TypeScript, and Tailwind CSS.
- **Backend**: Managed via Supabase services:
  - **Authentication**: Secure user login.
  - **PostgreSQL**: Database for recordings, transcriptions, and meetings.
  - **Storage**: Audio files are saved in Supabase Storage.
  - **Edge Functions**: Handles transcription, summarization, and Outlook scraping.

### 3.2. System Flow
1. **Authentication**: Managed by Supabase with JWT tokens.
2. **Recording & Transcription**:
   - Audio recorded via the browser is stored in Supabase.
   - Edge Functions use Deepgram API for transcription, stored in the database.
3. **Summarization**: Processed using LLM and stored alongside transcription.
4. **Outlook Integration**: Meeting data fetched via `win32com` and linked to transcriptions.
5. **Real-time Updates**: Users receive live updates via Supabase Realtime.

## 4. Functional Requirements
### 4.1. Core Features
1. **User Authentication**: Sign-up, login, password recovery.
2. **Audio Recording**: In-browser recording and storage.
3. **Transcription**: Real-time using Deepgram API.
4. **Summarization**: Generated from transcriptions via LLM.

## 6. Detailed Component Design
### 6.1. Backend (Supabase)
#### **6.1.1. Authentication**
- **Service**: Supabase Authentication, supports JWT-based sessions and password recovery.

#### **6.1.2. Database Schema**
- **Users**: Stores user profile information (`id`, `display_name`, `avatar_url`, etc.).
- **Recordings**: Tracks recording data (`id`, `user_id`, `path`, `created_at`).
- **Transcripts**: Includes transcription and summary (`recording_id`, `content`, `summary`).
- **Meetings**: Meeting details (`user_id`, `title`, `date_time`).

#### **6.1.3. Storage and Real-time Subscriptions**
- **Storage**: **audio-recordings** bucket for user-specific audio files.
- **Realtime**: Updates triggered on transcription creation and meetings.

#### **6.1.4. Edge Functions**
- **Transcription Process**: Triggered by new audio uploads, using Deepgram for transcription.
- **Summarization**: Generates summaries from transcription content.
- **Outlook Integration**: Scrapes Outlook meetings to associate with transcriptions.
### 3.1.2 High Level Overview of Pages

The application comprises several key pages, each serving distinct functionalities:

1. **HomePage**:
   - **New Recording**: Interface to start and stop audio recordings.
   - **Live Transcription Toggle**: Enable or disable real-time transcription.
   - **Transcription Display**: View and manage transcriptions related to recordings.

2. **My Recordings**:
   - **Recordings List**: Display all user recordings with options to play, transcribe, or delete.
   - **Filters and Sorting**: Search and organize recordings based on various criteria.

3. **My Transcriptions**:
   - **Transcriptions Dashboard**: View, search, filter, and manage all transcriptions.
   - **Detailed Transcription View**: Access full transcription content, summaries, and analysis.
   - **Analytics**: Visual insights into transcription usage and trends.

4. **Meetings**:
   - **Meetings List**: Display scheduled Outlook meetings associated with transcriptions.
   - **Meeting Details**: View and manage meeting-specific transcriptions.

5. **Settings**:
   - **User Preferences**: Manage notification settings, themes, and account details.
   - **Integration Settings**: Configure Outlook integration and API keys.

6. **User Profile**:
   - **Profile Information**: View and edit user profile details.
   - **Authentication Actions**: Logout and manage authentication methods.

### 3.2. Technology Stack

- **Frontend**:
  - **React**
  - **TypeScript**
  - **Tailwind CSS**
  - **React Router**
  - **Lucide Icons**

### **6.1.2. Database Schema**
- **Users**: Stores user profile information (id, display_name, avatar_url, etc.).
- **Recordings**: Tracks recording data (id, user_id, path, created_at).
- **Transcripts**: Includes transcription and summary (recording_id, content, summary).
- **Meetings**: Meeting details (user_id, title, date_time).

---
<ISSUE>
The transcript page is not working as epected. The message "Failed to fetch transcriptions" is displayed.
The issue seems to be with the connection of the backend and the frontend. 
The backend is a supabase project and the frontend is a react app.
 - MyTranscripts.tsx
 - TagManager.tsx
 - TranscriptTimeline.tsx
 
<schema>
Table: transcripts (Schema: public)
transcript_id (bigint, NOT NULL): Auto-incrementing ID.
meeting_id (bigint, nullable): Foreign key referencing meetings(meeting_id).
content (text, nullable): Transcript content.
recording_id (bigint, nullable): Foreign key referencing recordings(recording_id).
user_id (string, NOT NULL): Foreign key referencing auth.users(id).
</schema>
</ISSUE>

{get_tree_structure()}

        """
        md_file.write(text)

    all_relevant_files = []
    for path in paths:
        if os.path.isdir(path):
            found_files = find_relevant_files(path, extensions)
            if not found_files:
                print(f"Warning: No files with extensions {extensions} found in directory '{path}'.")
            all_relevant_files.extend(found_files)
        elif os.path.isfile(path) and path.endswith(extensions):
            all_relevant_files.append(path)
        else:
            print(f"Warning: '{path}' is neither a directory nor a supported file type. Skipping.")

    if not all_relevant_files:
        print("No relevant files found. Exiting.")
        return

    for module_path in all_relevant_files:
        try:
            with open(module_path, 'r', encoding='utf-8') as file:
                code = file.read()
        except (UnicodeDecodeError, PermissionError) as e:
            print(f"Warning: Could not read '{module_path}'. Reason: {e}")
            continue

        markdown_content = f"```{os.path.splitext(module_path)[1][1:]}\n{code}\n```"

        with open(output_path, 'a', encoding='utf-8') as md_file:
            md_file.write('-----------------------------------\n')
            md_file.write(f"# {module_path}\n-----------------------------------\n")
            md_file.write(markdown_content)
            md_file.write('\n===\n')

        print(f"Module '{module_path}' has been successfully written to '{output_path}' in Markdown format.")

if __name__ == "__main__":
    # Specify the paths to directories or Python modules and the desired output Markdown file
    # paths = ['./frontend/public','./frontend/src','./supabase/functions']  # Ensure 'src' is a valid directory relative to where the script is run
    paths = ['Dashboard-App/home', 'Dashboard-App/src']
    output_path = 'module_code.md'
    extensions = ('.py', '.tsx', '.ts')  # Add any other extensions you need

    # Enhanced error handling to check if 'src' exists
    for path in paths:
        if not os.path.exists(path):
            print(f"Error: The path '{path}' does not exist. Please provide a valid directory or file.")
            exit(1)

    module_to_markdown(paths, output_path, extensions)
