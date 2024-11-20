CREATE TABLE MULTIDB.ACTIVE_SESSION (
    user_created_at  DATE NOT NULL,
	device           VARCHAR2(255) NULL,
	agent            VARCHAR2(255) NULL,
	signed_in        DATE NULL,
    user_id       VARCHAR2(255) NOT NULL,
	CONSTRAINT pk_sessions PRIMARY KEY (user_id, user_created_at, device),
	CONSTRAINT fk_users_session FOREIGN KEY (user_id, user_created_at) REFERENCES MULTIDB.USERS(username, created_at)
);