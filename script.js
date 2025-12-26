// 文件夹应用类
class FolderApp {
    constructor() {
        this.folders = JSON.parse(localStorage.getItem('folders')) || [];
        this.draggedNoteId = null;
        this.currentFolderFilter = null;
        this.editingFolderId = null;
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.render();
        this.updateFolderFilter();
    }

    // 绑定事件监听器
    bindEvents() {
        // 打开文件夹管理模态框
        document.getElementById('foldersBtn').addEventListener('click', () => this.openFoldersModal());
        
        // 关闭文件夹管理模态框
        document.getElementById('closeFoldersModal').addEventListener('click', () => this.closeFoldersModal());
        
        // 打开创建文件夹模态框
        document.getElementById('createFolderBtn').addEventListener('click', () => this.openCreateFolderModal());
        
        // 关闭创建文件夹模态框
        document.getElementById('cancelCreateFolder').addEventListener('click', () => this.closeCreateFolderModal());
        
        // 保存创建文件夹
        document.getElementById('saveCreateFolder').addEventListener('click', () => this.saveCreateFolder());
        
        // 文件夹名称输入验证
        document.getElementById('folderName').addEventListener('input', (e) => this.validateFolderName(e.target.value));
        
        // 文件夹筛选
        document.getElementById('folderFilter').addEventListener('change', (e) => this.filterNotes(e.target.value));
        
        // 清除筛选
        document.getElementById('clearFilterBtn').addEventListener('click', () => this.clearFilter());
        
        // 重命名文件夹模态框事件
        document.getElementById('cancelRenameFolder').addEventListener('click', () => this.closeRenameFolderModal());
        document.getElementById('saveRenameFolder').addEventListener('click', () => this.saveRenameFolder());
        document.getElementById('renameFolderName').addEventListener('input', (e) => this.validateRenameFolderName(e.target.value));
        
        // 点击模态框外部关闭
        document.getElementById('foldersModal').addEventListener('click', (e) => {
            if (e.target.id === 'foldersModal') {
                this.closeFoldersModal();
            }
        });
        
        document.getElementById('createFolderModal').addEventListener('click', (e) => {
            if (e.target.id === 'createFolderModal') {
                this.closeCreateFolderModal();
            }
        });
        
        document.getElementById('renameFolderModal').addEventListener('click', (e) => {
            if (e.target.id === 'renameFolderModal') {
                this.closeRenameFolderModal();
            }
        });
    }

    // 打开文件夹管理模态框
    openFoldersModal() {
        const modal = document.getElementById('foldersModal');
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.renderFoldersModal();
    }

    // 关闭文件夹管理模态框
    closeFoldersModal() {
        const modal = document.getElementById('foldersModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }

    // 打开创建文件夹模态框
    openCreateFolderModal() {
        const modal = document.getElementById('createFolderModal');
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.getElementById('folderName').value = '';
        document.getElementById('folderNameError').textContent = '';
    }

    // 关闭创建文件夹模态框
    closeCreateFolderModal() {
        const modal = document.getElementById('createFolderModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
    
    // 打开重命名文件夹模态框
    openRenameFolderModal(folderId) {
        this.editingFolderId = folderId;
        const folder = this.folders.find(f => f.id === folderId);
        if (folder) {
            const modal = document.getElementById('renameFolderModal');
            modal.classList.add('active');
            modal.style.display = 'flex';
            document.getElementById('renameFolderName').value = folder.name;
            document.getElementById('renameFolderNameError').textContent = '';
            document.body.style.overflow = 'hidden';
        }
    }
    
    // 关闭重命名文件夹模态框
    closeRenameFolderModal() {
        this.editingFolderId = null;
        const modal = document.getElementById('renameFolderModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }

    // 验证文件夹名称
    validateFolderName(name) {
        const errorElement = document.getElementById('folderNameError');
        
        if (!name.trim()) {
            errorElement.textContent = '文件夹名称不能为空';
            return false;
        }
        
        if (name.length > 50) {
            errorElement.textContent = '文件夹名称不能超过50个字符';
            return false;
        }
        
        // 检查特殊字符
        const specialChars = /[<>:/\\|?*"]/;
        if (specialChars.test(name)) {
            errorElement.textContent = '文件夹名称不能包含特殊字符';
            return false;
        }
        
        // 检查是否重名
        if (this.folders.some(folder => folder.name === name.trim())) {
            errorElement.textContent = '文件夹名称已存在';
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }
    
    // 验证重命名文件夹名称
    validateRenameFolderName(name) {
        const errorElement = document.getElementById('renameFolderNameError');
        const folder = this.folders.find(f => f.id === this.editingFolderId);
        
        if (!name.trim()) {
            errorElement.textContent = '文件夹名称不能为空';
            return false;
        }
        
        if (name.length > 50) {
            errorElement.textContent = '文件夹名称不能超过50个字符';
            return false;
        }
        
        // 检查特殊字符
        const specialChars = /[<>:/\\|?*"]/;
        if (specialChars.test(name)) {
            errorElement.textContent = '文件夹名称不能包含特殊字符';
            return false;
        }
        
        // 检查是否重名（排除自身）
        if (this.folders.some(f => f.id !== this.editingFolderId && f.name === name.trim())) {
            errorElement.textContent = '文件夹名称已存在';
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }
    
    // 保存重命名文件夹
    saveRenameFolder() {
        const folderName = document.getElementById('renameFolderName').value.trim();
        
        if (!this.validateRenameFolderName(folderName)) {
            return;
        }
        
        const folder = this.folders.find(f => f.id === this.editingFolderId);
        if (folder) {
            folder.name = folderName;
            folder.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.render();
            this.updateFolderFilter();
            this.closeRenameFolderModal();
            this.renderFoldersModal();
        }
    }

    // 保存创建文件夹
    saveCreateFolder() {
        const folderName = document.getElementById('folderName').value.trim();
        
        if (!this.validateFolderName(folderName)) {
            return;
        }
        
        const folder = {
            id: Date.now(),
            name: folderName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.folders.push(folder);
        this.saveToStorage();
        this.render();
        this.updateFolderFilter();
        this.closeCreateFolderModal();
        this.renderFoldersModal();
    }

    // 重命名文件夹
    renameFolder(id, newName) {
        const folder = this.folders.find(f => f.id === id);
        if (folder) {
            folder.name = newName;
            folder.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.render();
            this.updateFolderFilter();
            this.renderFoldersModal();
        }
    }

    // 删除文件夹
    deleteFolder(id) {
        if (confirm('确定要删除这个文件夹吗？文件夹中的笔记将被移到根目录。')) {
            // 将文件夹中的笔记移到根目录
            if (window.noteApp) {
                window.noteApp.notes.forEach(note => {
                    if (note.folderId === id) {
                        note.folderId = null;
                    }
                });
                window.noteApp.saveToStorage();
                window.noteApp.render();
            }
            
            // 删除文件夹
            this.folders = this.folders.filter(f => f.id !== id);
            this.saveToStorage();
            this.render();
            this.updateFolderFilter();
            this.renderFoldersModal();
        }
    }

    // 获取文件夹中的笔记数量
    getFolderNoteCount(folderId) {
        if (!window.noteApp) return 0;
        return window.noteApp.notes.filter(note => note.folderId === folderId).length;
    }

    // 渲染文件夹管理模态框
    renderFoldersModal() {
        this.renderFoldersList();
        this.renderFolderNotesList();
    }

    // 渲染文件夹列表
    renderFoldersList() {
        const foldersList = document.getElementById('foldersList');
        
        if (this.folders.length === 0) {
            foldersList.innerHTML = '<div class="empty-state-text">还没有创建文件夹</div>';
            return;
        }
        
        foldersList.innerHTML = this.folders.map(folder => `
            <div class="folder-item" data-id="${folder.id}" ondragover="folderApp.handleDragOver(event)" ondrop="folderApp.handleDrop(event, ${folder.id})">
                <div class="folder-content">
                    <div class="folder-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <span class="folder-name">${this.escapeHtml(folder.name)}</span>
                    <span class="folder-count">${this.getFolderNoteCount(folder.id)}</span>
                </div>
                <div class="folder-actions">
                    <button 
                        class="action-btn" 
                        onclick="folderApp.openRenameFolderModal(${folder.id})"
                        aria-label="重命名文件夹"
                        title="重命名"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button 
                        class="action-btn delete" 
                        onclick="folderApp.deleteFolder(${folder.id})"
                        aria-label="删除文件夹"
                        title="删除"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 渲染文件夹笔记列表
    renderFolderNotesList() {
        const folderNotesList = document.getElementById('folderNotesList');
        
        if (!window.noteApp || window.noteApp.notes.length === 0) {
            folderNotesList.innerHTML = '<div class="empty-state-text">还没有笔记</div>';
            return;
        }
        
        folderNotesList.innerHTML = window.noteApp.notes.map(note => `
            <div 
                class="folder-note-item" 
                data-id="${note.id}"
                draggable="true"
                ondragstart="folderApp.handleDragStart(event, ${note.id})"
                ondragend="folderApp.handleDragEnd(event)"
            >
                <div class="folder-note-content">
                    <div class="folder-note-title">${this.escapeHtml(note.title || '无标题笔记')}</div>
                    <div class="folder-note-meta">
                        ${note.folderId ? `文件夹: ${this.getFolderName(note.folderId)}` : '无文件夹'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 处理拖拽开始
    handleDragStart(event, noteId) {
        this.draggedNoteId = noteId;
        event.target.classList.add('dragging');
    }

    // 处理拖拽结束
    handleDragEnd(event) {
        event.target.classList.remove('dragging');
        // 移除所有文件夹的高亮状态
        document.querySelectorAll('.folder-item').forEach(item => {
            item.classList.remove('drag-over');
        });
        this.draggedNoteId = null;
    }
    
    // 处理拖拽经过
    handleDragOver(event) {
        event.preventDefault();
        // 移除所有文件夹的高亮状态
        document.querySelectorAll('.folder-item').forEach(item => {
            item.classList.remove('drag-over');
        });
        // 高亮当前经过的文件夹
        event.currentTarget.classList.add('drag-over');
    }
    
    // 处理拖拽放置
    handleDrop(event, folderId) {
        event.preventDefault();
        // 移除所有文件夹的高亮状态
        document.querySelectorAll('.folder-item').forEach(item => {
            item.classList.remove('drag-over');
        });
        
        if (this.draggedNoteId && window.noteApp) {
            const note = window.noteApp.notes.find(n => n.id === this.draggedNoteId);
            if (note) {
                note.folderId = folderId;
                window.noteApp.saveToStorage();
                window.noteApp.render();
                this.renderFoldersModal();
            }
        }
    }

    // 获取文件夹名称
    getFolderName(folderId) {
        if (!folderId) return '';
        const folder = this.folders.find(f => f.id === folderId);
        return folder ? folder.name : '未找到文件夹';
    }

    // 渲染文件夹相关UI
    render() {
        this.renderFoldersModal();
        this.updateFolderFilter();
    }

    // 更新文件夹筛选器
    updateFolderFilter() {
        const folderFilter = document.getElementById('folderFilter');
        const currentFilter = folderFilter.value;
        
        // 清空现有选项
        folderFilter.innerHTML = '<option value="">所有文件夹</option>';
        
        // 添加文件夹选项
        this.folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = folder.name;
            if (currentFilter === folder.id.toString()) {
                option.selected = true;
            }
            folderFilter.appendChild(option);
        });
    }

    // 筛选笔记
    filterNotes(folderId) {
        this.currentFolderFilter = folderId ? parseInt(folderId) : null;
        if (window.noteApp) {
            window.noteApp.render();
            
            // 显示/隐藏清除筛选按钮
            const clearFilterBtn = document.getElementById('clearFilterBtn');
            clearFilterBtn.style.display = folderId ? 'flex' : 'none';
        }
    }
    
    // 清除筛选
    clearFilter() {
        const folderFilter = document.getElementById('folderFilter');
        folderFilter.value = '';
        this.currentFolderFilter = null;
        if (window.noteApp) {
            window.noteApp.render();
            
            // 显示/隐藏清除筛选按钮
            const clearFilterBtn = document.getElementById('clearFilterBtn');
            clearFilterBtn.style.display = 'none';
        }
    }

    // 保存到本地存储
    saveToStorage() {
        localStorage.setItem('folders', JSON.stringify(this.folders));
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 笔记应用类
class NoteApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentNoteId = null;
        this.selectedTodoIds = [];
        this.currentFolderFilter = null;
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.render();
    }

    // 绑定事件监听器
    bindEvents() {
        // 新建笔记
        document.getElementById('newNoteBtn').addEventListener('click', () => this.createNote());
        
        // 保存笔记
        document.getElementById('saveNoteBtn').addEventListener('click', () => this.saveNote());
        
        // 删除笔记
        document.getElementById('deleteNoteBtn').addEventListener('click', () => this.deleteNote());
        
        // 笔记标题和内容变化时自动保存
        document.getElementById('noteTitle').addEventListener('input', () => this.autoSave());
        document.getElementById('noteContent').addEventListener('input', () => {
            this.autoSave();
            this.updatePreview();
        });
        
        // 编辑/预览模式切换
        document.getElementById('editViewBtn').addEventListener('click', () => this.showEditMode());
        document.getElementById('previewViewBtn').addEventListener('click', () => this.showPreviewMode());
        
        // 关联待办事项
        document.getElementById('addNoteTodoBtn').addEventListener('click', () => this.openLinkTodoModal());
        
        // 关联待办事项模态框事件
        document.getElementById('cancelLinkTodo').addEventListener('click', () => this.closeLinkTodoModal());
        document.getElementById('saveLinkTodo').addEventListener('click', () => this.saveLinkTodo());
        
        // 点击关联待办事项模态框外部关闭
        document.getElementById('linkTodoModal').addEventListener('click', (e) => {
            if (e.target.id === 'linkTodoModal') {
                this.closeLinkTodoModal();
            }
        });
    }

    // 创建新笔记
    createNote() {
        const note = {
            id: Date.now(),
            title: "",
            content: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            folderId: null,
            todoIds: []
        };
        
        this.notes.unshift(note);
        this.currentNoteId = note.id;
        this.saveToStorage();
        this.render();
        this.showEditor();
    }

    // 保存笔记
    saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        
        if (!this.currentNoteId) return;
        
        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (note) {
            note.title = title || "无标题笔记";
            note.content = content;
            note.updatedAt = new Date().toISOString();
            
            this.saveToStorage();
            this.render();
        }
    }

    // 自动保存笔记
    autoSave() {
        // 使用防抖，避免频繁保存
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveNote();
        }, 1000);
    }

    // 删除笔记
    deleteNote() {
        if (!this.currentNoteId) return;
        
        if (confirm('确定要删除这篇笔记吗？此操作不可恢复。')) {
            // 移除关联的待办事项
            const note = this.notes.find(n => n.id === this.currentNoteId);
            if (note && note.todoIds) {
                // 在待办事项中移除关联
                if (window.todoApp) {
                    window.todoApp.removeNoteAssociations(this.currentNoteId);
                }
            }
            
            // 删除笔记
            this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
            this.currentNoteId = null;
            
            this.saveToStorage();
            this.render();
            this.hideEditor();
        }
    }

    // 选择笔记
    selectNote(id) {
        this.currentNoteId = id;
        this.render();
        this.showEditor();
    }

    // 显示编辑器
    showEditor() {
        document.getElementById('emptyNoteState').style.display = 'none';
        document.getElementById('noteEditor').style.display = 'flex';
        
        this.loadNote();
        this.showEditMode();
    }

    // 隐藏编辑器
    hideEditor() {
        document.getElementById('emptyNoteState').style.display = 'flex';
        document.getElementById('noteEditor').style.display = 'none';
        
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
    }

    // 显示编辑模式
    showEditMode() {
        document.getElementById('editMode').classList.add('active');
        document.getElementById('previewMode').classList.remove('active');
        document.getElementById('editMode').style.display = 'flex';
        document.getElementById('previewMode').style.display = 'none';
        
        document.getElementById('editViewBtn').classList.add('active');
        document.getElementById('previewViewBtn').classList.remove('active');
    }

    // 显示预览模式
    showPreviewMode() {
        this.updatePreview();
        document.getElementById('editMode').classList.remove('active');
        document.getElementById('previewMode').classList.add('active');
        document.getElementById('editMode').style.display = 'none';
        document.getElementById('previewMode').style.display = 'flex';
        
        document.getElementById('editViewBtn').classList.remove('active');
        document.getElementById('previewViewBtn').classList.add('active');
    }

    // 更新预览
    updatePreview() {
        const content = document.getElementById('noteContent').value;
        const preview = document.getElementById('notePreview');
        preview.innerHTML = marked.parse(content) || '<div class="empty-state-text">笔记内容为空</div>';
    }

    // 加载笔记到编辑器
    loadNote() {
        if (!this.currentNoteId) return;
        
        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (note) {
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            this.renderNoteTodos();
            this.updatePreview();
        }
    }

    // 渲染笔记列表
    render() {
        const notesList = document.getElementById('notesList');
        
        if (this.notes.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">还没有笔记，点击上方按钮创建第一篇吧！</div>
                </div>
            `;
            return;
        }
        
        // 根据文件夹筛选笔记
        let filteredNotes = this.notes;
        if (window.folderApp && window.folderApp.currentFolderFilter) {
            filteredNotes = this.notes.filter(note => note.folderId === window.folderApp.currentFolderFilter);
        }
        
        // 渲染筛选后的笔记
        if (filteredNotes.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">当前文件夹中没有笔记</div>
                </div>
            `;
            return;
        }
        
        notesList.innerHTML = filteredNotes.map(note => {
            const folderName = window.folderApp ? window.folderApp.getFolderName(note.folderId) : '';
            return `
                <div class="note-item ${this.currentNoteId === note.id ? 'active' : ''} ${note.folderId && folderName ? 'note-item-with-folder' : ''}" data-id="${note.id}" onclick="noteApp.selectNote(${note.id})">
                    <div class="note-item-title">${this.escapeHtml(note.title || '无标题笔记')}</div>
                    <div class="note-item-preview">${this.escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</div>
                    <div class="note-item-date">${this.formatDate(note.updatedAt)}</div>
                    ${note.folderId && folderName ? `<div class="note-item-folder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg> ${folderName}
                    </div>` : ''}
                </div>
            `;
        }).join('');
    }

    // 渲染笔记关联的待办事项
    renderNoteTodos() {
        const noteTodos = document.getElementById('noteTodos');
        
        if (!this.currentNoteId) {
            noteTodos.innerHTML = '<div class="empty-state-text">选择笔记查看关联的待办事项</div>';
            return;
        }
        
        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (!note || !note.todoIds || note.todoIds.length === 0) {
            noteTodos.innerHTML = '<div class="empty-state-text">没有关联的待办事项</div>';
            return;
        }
        
        // 获取关联的待办事项
        const todos = window.todoApp ? window.todoApp.todos.filter(t => note.todoIds.includes(t.id)) : [];
        
        noteTodos.innerHTML = todos.map(todo => `
            <div class="note-todo-item ${todo.completed ? 'completed' : ''}">
                <div class="checkbox-container">
                    <input 
                        type="checkbox" 
                        id="note-todo-${todo.id}" 
                        class="todo-checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="window.todoApp.toggleTodo(${todo.id})"
                        aria-label="${todo.completed ? '标记为未完成' : '标记为已完成'}"
                    >
                    <label for="note-todo-${todo.id}" class="checkbox-custom"></label>
                </div>
                <span class="note-todo-text">${this.escapeHtml(todo.text)}</span>
                <button 
                    class="action-btn delete" 
                    onclick="noteApp.unlinkTodoFromNote(${note.id}, ${todo.id})"
                    aria-label="取消关联"
                    title="取消关联"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // 打开关联待办事项模态框
    openLinkTodoModal() {
        if (!this.currentNoteId) return;
        
        const modal = document.getElementById('linkTodoModal');
        const todoSelectList = document.getElementById('todoSelectList');
        
        // 清空现有选项
        todoSelectList.innerHTML = '';
        
        // 获取当前笔记
        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (!note) return;
        
        // 获取所有待办事项
        const todos = window.todoApp ? window.todoApp.todos : [];
        
        if (todos.length === 0) {
            todoSelectList.innerHTML = '<div class="empty-state-text">还没有待办事项</div>';
        } else {
            // 渲染待办事项选项
            todoSelectList.innerHTML = todos.map(todo => `
                <div class="todo-select-item ${note.todoIds && note.todoIds.includes(todo.id) ? 'selected' : ''}" data-id="${todo.id}" onclick="noteApp.toggleTodoSelection(${todo.id})">
                    <div class="checkbox-container">
                        <input 
                            type="checkbox" 
                            id="select-todo-${todo.id}" 
                            class="todo-checkbox" 
                            ${note.todoIds && note.todoIds.includes(todo.id) ? 'checked' : ''}
                            onchange="noteApp.toggleTodoSelection(${todo.id})"
                            aria-label="${note.todoIds && note.todoIds.includes(todo.id) ? '取消关联' : '关联'}"
                        >
                        <label for="select-todo-${todo.id}" class="checkbox-custom"></label>
                    </div>
                    <span class="todo-select-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
                </div>
            `).join('');
        }
        
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭关联待办事项模态框
    closeLinkTodoModal() {
        const modal = document.getElementById('linkTodoModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
    
    // 切换待办事项选择状态
    toggleTodoSelection(id) {
        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (!note) return;
        
        if (!note.todoIds) {
            note.todoIds = [];
        }
        
        const index = note.todoIds.indexOf(id);
        if (index > -1) {
            note.todoIds.splice(index, 1);
        } else {
            note.todoIds.push(id);
        }
        
        // 更新待办事项的关联
        if (window.todoApp) {
            const todo = window.todoApp.todos.find(t => t.id === id);
            if (todo) {
                todo.noteId = index > -1 ? null : this.currentNoteId;
                window.todoApp.saveToStorage();
                window.todoApp.render();
            }
        }
        
        this.saveToStorage();
        this.renderNoteTodos();
        this.openLinkTodoModal(); // 重新渲染模态框
    }
    
    // 保存关联待办事项
    saveLinkTodo() {
        this.closeLinkTodoModal();
    }

    // 获取笔记列表
    getNotes() {
        return this.notes;
    }

    // 关联待办事项到笔记
    linkTodoToNote(noteId, todoId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            if (!note.todoIds) {
                note.todoIds = [];
            }
            if (!note.todoIds.includes(todoId)) {
                note.todoIds.push(todoId);
                this.saveToStorage();
                this.render();
                if (this.currentNoteId === noteId) {
                    this.renderNoteTodos();
                }
            }
        }
    }

    // 从笔记中移除待办事项关联
    unlinkTodoFromNote(noteId, todoId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note && note.todoIds) {
            note.todoIds = note.todoIds.filter(id => id !== todoId);
            this.saveToStorage();
            this.render();
            
            // 更新待办事项的关联
            if (window.todoApp) {
                const todo = window.todoApp.todos.find(t => t.id === todoId);
                if (todo) {
                    todo.noteId = null;
                    window.todoApp.saveToStorage();
                    window.todoApp.render();
                }
            }
            
            if (this.currentNoteId === noteId) {
                this.renderNoteTodos();
            }
        }
    }

    // 保存到本地存储
    saveToStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return '昨天';
        } else if (days < 7) {
            return `${days}天前`;
        } else {
            return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        }
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 待办事项应用类
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.editingId = null;
        this.linkNoteId = null;
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.render();
        this.initTheme();
    }

    // 绑定事件监听器
    bindEvents() {
        // 添加待办事项
        document.getElementById('addTodo').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // 主题切换
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // 清除已完成
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());

        // 清空所有
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());

        // 编辑模态框事件
        document.getElementById('cancelEdit').addEventListener('click', () => this.closeEditModal());
        document.getElementById('saveEdit').addEventListener('click', () => this.saveEdit());
        document.getElementById('editInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveEdit();
            }
        });

        // 点击模态框外部关闭
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });
        
        // 关联笔记模态框事件
        document.getElementById('cancelLinkNote').addEventListener('click', () => this.closeLinkNoteModal());
        document.getElementById('saveLinkNote').addEventListener('click', () => this.saveLinkNote());
        
        // 点击关联笔记模态框外部关闭
        document.getElementById('linkNoteModal').addEventListener('click', (e) => {
            if (e.target.id === 'linkNoteModal') {
                this.closeLinkNoteModal();
            }
        });
    }

    // 添加待办事项
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            noteId: null
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        this.render();
        input.value = '';
        input.focus();
    }

    // 切换待办事项状态
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.render();
            // 更新笔记中的待办事项状态
            if (window.noteApp && todo.noteId) {
                window.noteApp.renderNoteTodos();
            }
        }
    }

    // 编辑待办事项
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingId = id;
            document.getElementById('editInput').value = todo.text;
            this.openEditModal();
        }
    }

    // 删除待办事项
    deleteTodo(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.classList.add('slide-out');
            setTimeout(() => {
                const todo = this.todos.find(t => t.id === id);
                if (todo && todo.noteId && window.noteApp) {
                    // 从笔记中移除关联
                    window.noteApp.unlinkTodoFromNote(todo.noteId, id);
                }
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveToStorage();
                this.render();
            }, 300);
        }
    }

    // 打开编辑模态框
    openEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.getElementById('editInput').focus();
        document.body.style.overflow = 'hidden';
    }

    // 关闭编辑模态框
    closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        this.editingId = null;
        document.body.style.overflow = 'auto';
    }

    // 保存编辑
    saveEdit() {
        const input = document.getElementById('editInput');
        const text = input.value.trim();

        if (text === '' || this.editingId === null) {
            this.closeEditModal();
            return;
        }

        const todo = this.todos.find(t => t.id === this.editingId);
        if (todo) {
            todo.text = text;
            todo.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.render();
            // 更新笔记中的待办事项文本
            if (window.noteApp && todo.noteId) {
                window.noteApp.renderNoteTodos();
            }
            this.closeEditModal();
        }
    }

    // 打开关联笔记模态框
    openLinkNoteModal(id) {
        this.linkNoteId = id;
        const modal = document.getElementById('linkNoteModal');
        const noteSelect = document.getElementById('noteSelect');
        
        // 清空现有选项
        noteSelect.innerHTML = '<option value="">取消关联</option>';
        
        // 获取当前待办事项
        const todo = this.todos.find(t => t.id === id);
        
        // 添加笔记选项
        if (window.noteApp) {
            const notes = window.noteApp.getNotes();
            notes.forEach(note => {
                const option = document.createElement('option');
                option.value = note.id;
                option.textContent = note.title || '无标题笔记';
                // 设置当前关联的笔记为选中状态
                if (todo && todo.noteId === note.id) {
                    option.selected = true;
                }
                noteSelect.appendChild(option);
            });
        }
        
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭关联笔记模态框
    closeLinkNoteModal() {
        const modal = document.getElementById('linkNoteModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        this.linkNoteId = null;
        document.body.style.overflow = 'auto';
    }
    
    // 保存关联笔记
    saveLinkNote() {
        if (!this.linkNoteId) return;
        
        const noteId = document.getElementById('noteSelect').value;
        const todo = this.todos.find(t => t.id === this.linkNoteId);
        
        if (todo) {
            // 移除旧的关联
            if (todo.noteId && window.noteApp) {
                window.noteApp.unlinkTodoFromNote(todo.noteId, todo.id);
            }
            
            // 添加新的关联
            todo.noteId = noteId ? parseInt(noteId) : null;
            if (todo.noteId && window.noteApp) {
                window.noteApp.linkTodoToNote(todo.noteId, todo.id);
            }
            
            this.saveToStorage();
            this.render();
        }
        
        this.closeLinkNoteModal();
    }

    // 移除笔记关联
    removeNoteAssociations(noteId) {
        this.todos.forEach(todo => {
            if (todo.noteId === noteId) {
                todo.noteId = null;
            }
        });
        this.saveToStorage();
        this.render();
    }

    // 清除已完成
    clearCompleted() {
        const completedTodos = this.todos.filter(t => t.completed);
        if (completedTodos.length === 0) {
            return;
        }

        if (confirm(`确定要清除所有 ${completedTodos.length} 个已完成的待办事项吗？`)) {
            // 移除与笔记的关联
            completedTodos.forEach(todo => {
                if (todo.noteId && window.noteApp) {
                    window.noteApp.unlinkTodoFromNote(todo.noteId, todo.id);
                }
            });
            
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    // 清空所有
    clearAll() {
        if (this.todos.length === 0) {
            return;
        }

        if (confirm('确定要清空所有待办事项吗？此操作不可恢复。')) {
            // 移除所有与笔记的关联
            this.todos.forEach(todo => {
                if (todo.noteId && window.noteApp) {
                    window.noteApp.unlinkTodoFromNote(todo.noteId, todo.id);
                }
            });
            
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    // 渲染待办事项列表
    render() {
        const todoList = document.getElementById('todoList');
        const remainingCount = document.getElementById('remainingCount');
        const totalCount = document.getElementById('totalCount');
        const actions = document.getElementById('actions');

        // 更新统计信息
        const remaining = this.todos.filter(t => !t.completed).length;
        remainingCount.textContent = remaining;
        totalCount.textContent = this.todos.length;

        // 显示/隐藏操作按钮
        actions.style.display = this.todos.length > 0 ? 'flex' : 'none';

        // 渲染待办事项列表
        if (this.todos.length === 0) {
            todoList.innerHTML = `
                <li class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">还没有待办事项，点击上方添加第一个吧！</div>
                </li>
            `;
            return;
        }

        todoList.innerHTML = this.todos.map(todo => `
            <li class="todo-item" data-id="${todo.id}">
                <div class="checkbox-container">
                    <input 
                        type="checkbox" 
                        id="todo-${todo.id}" 
                        class="todo-checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="todoApp.toggleTodo(${todo.id})"
                        aria-label="${todo.completed ? '标记为未完成' : '标记为已完成'}"
                    >
                    <label for="todo-${todo.id}" class="checkbox-custom"></label>
                </div>
                
                <div class="todo-content">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <div class="todo-meta">
                        <span>${this.formatDate(todo.createdAt)}</span>
                        ${todo.updatedAt !== todo.createdAt ? `<span>· 已编辑</span>` : ''}
                        ${todo.noteId ? `<span>· 已关联笔记</span>` : ''}
                    </div>
                </div>
                
                <div class="todo-actions">
                    <button 
                        class="action-btn" 
                        onclick="todoApp.editTodo(${todo.id})"
                        aria-label="编辑待办事项"
                        title="编辑"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button 
                        class="action-btn" 
                        onclick="todoApp.openLinkNoteModal(${todo.id})"
                        aria-label="关联到笔记"
                        title="关联到笔记"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </button>
                    <button 
                        class="action-btn delete" 
                        onclick="todoApp.deleteTodo(${todo.id})"
                        aria-label="删除待办事项"
                        title="删除"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </li>
        `).join('');
    }

    // 初始化主题
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // 切换主题
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // 清空所有待办事项
    clearAll() {
        if (this.todos.length === 0) {
            return;
        }

        if (confirm('确定要清空所有待办事项吗？此操作不可恢复。')) {
            // 移除与笔记的关联
            this.todos.forEach(todo => {
                if (todo.noteId && window.noteApp) {
                    window.noteApp.unlinkTodoFromNote(todo.noteId, todo.id);
                }
            });
            
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    // 保存到本地存储
    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return '昨天';
        } else if (days < 7) {
            return `${days}天前`;
        } else {
            return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        }
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 主应用控制器
class App {
    constructor() {
        this.currentView = 'notes';
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.showView(this.currentView);
    }

    // 绑定事件监听器
    bindEvents() {
        // 导航标签切换
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.showView(view);
            });
        });
    }

    // 显示指定视图
    showView(view) {
        // 隐藏所有视图
        document.querySelectorAll('.view').forEach(v => {
            v.style.display = 'none';
        });
        
        // 显示指定视图
        document.getElementById(`${view}View`).style.display = 'block';
        
        // 更新导航标签状态
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.currentView = view;
    }
}

// 初始化应用
const folderApp = new FolderApp();
const noteApp = new NoteApp();
const todoApp = new TodoApp();
const app = new App();

// 将实例挂载到window对象，以便HTML中的事件处理函数可以访问
window.folderApp = folderApp;
window.noteApp = noteApp;
window.todoApp = todoApp;
window.app = app;

// 确保笔记列表正确显示文件夹标识
noteApp.render();

// 监听主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
});
