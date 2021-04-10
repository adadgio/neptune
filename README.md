# sync

npm start

## Schema constraints

CREATE CONSTRAINT uniq_user ON (u:User) ASSERT u.id IS UNIQUE
CREATE CONSTRAINT uniq_document ON (d:Document) ASSERT d.id IS UNIQUE
CREATE CONSTRAINT uniq_folder ON (f:Folder) ASSERT f.id IS UNIQUE

