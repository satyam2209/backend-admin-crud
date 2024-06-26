const fs = require("fs");
const path = require("path");

// this is for location where the files are allow to save
const pathToFile = path.join(
  path.dirname(require.main.filename),
  "data",
  "notes.json"
);
// console.log(pathToFile);

const getDataFromFile = (callbackFn) => {
  fs.readFile(pathToFile, (err, fileContent) => {
    if (err) {
      return callbackFn([]);
    }
    callbackFn(JSON.parse(fileContent));
  });
};

module.exports = class Notes {
  constructor(_noteId, _title, _description, _imageUrl) {
    this.noteId = _noteId;
    this.title = _title;
    this.description = _description;
    this.imageUrl = _imageUrl;
    this.status = 'unapproved';
  }


  save() {
    //    console.log(this);
    // for create json file on given location
    //    const notes = [];

    // get existing notes
    // push the new note
    // save the changes
    getDataFromFile((notes) => {
      this.noteId = Math.floor(Math.random() * 1000).toString();
      notes.push(this);
      fs.writeFile(pathToFile, JSON.stringify(notes), (err) => {
        if (err) {
          console.log('error in saving file', err);
        }
      });
    });
  }


  saveChanges() {
    getDataFromFile((notes) => {
      const noteIndex = notes.findIndex((n) => n.noteId === this.noteId);
      const notesCopy = [...notes];
      notesCopy[noteIndex] = this;
      fs.writeFile(pathToFile, JSON.stringify(notesCopy), (err) => {
        if (err) {
          console.log('error in saving file', err);
        }
      });
    });
  }

  // it for return all data
  static fetchAll(callbackFn, isAdmin) {
    getDataFromFile((notes) => {
      if (isAdmin) {
        return callbackFn(notes);
      }
      const approvedNotes = notes.filter((n) => n.status === 'approved');
      callbackFn(approvedNotes);
    });
  }

  // it is for viewing a single notes
  static findNoteById(noteId, callbackFn) {
    getDataFromFile((notes) => {
      const note = notes.find((_note) => _note.noteId === noteId);
      callbackFn(note);
    });
  }


  static delete(noteId) {
    getDataFromFile((_notes) => {
      const notes = _notes.filter((n) => n.noteId !== noteId);
      fs.writeFile(pathToFile, JSON.stringify(notes), (err) => {
        if (err) {
          console.log('error in saving file', err);
        }
      });
    });
  }


  static approve(noteId) {
    getDataFromFile((notes) => {
      const noteIndex = notes.findIndex((n) => n.noteId === noteId);
      const notesCopy = [...notes];
      const singleNote = notesCopy[noteIndex];
      const notesToApprove = {
        ...singleNote,
        status: singleNote.status === 'approved' ? 'unapproved' : 'approved',
      };
      notesCopy[noteIndex] = notesToApprove;
      fs.writeFile(pathToFile, JSON.stringify(notesCopy), (err) => {
        if (err) {
          console.log('error in saving file', err);
        }
      });
    });
  }

  
};
