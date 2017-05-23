DELIMITER $$;
CREATE FUNCTION `getAbbr` (name varchar(255),lastName varchar(255))
RETURNS VARCHAR(3)
BEGIN

	RETURN CONCAT(LEFT(name,1),LEFT(lastName,1));
    
END;

DROP FUNCTION IF EXISTS coalesceForceVarchar;
DELIMITER $$;
CREATE FUNCTION `coalesceForceVarchar` (field1 varchar(255),field2 varchar(255),forceNull bool)
RETURNS VARCHAR(255)
BEGIN

	IF field1 is NULL THEN
		IF forceNull = true THEN
			RETURN NULL;
		ELSE
			RETURN field2;
		END IF;
    ELSE
		RETURN field1;
    END IF;
    
END;

DROP FUNCTION IF EXISTS coalesceForceDate;
DELIMITER $$;
CREATE FUNCTION `coalesceForceDate` (field1 datetime,field2 datetime,forceNull bool)
RETURNS datetime
BEGIN

	IF field1 is NULL THEN
		IF forceNull = true THEN
			RETURN NULL;
		ELSE
			RETURN field2;
		END IF;
    ELSE
		RETURN field1;
    END IF;
    
END;

DROP FUNCTION IF EXISTS coalesceForceInt;
DELIMITER $$;
CREATE FUNCTION `coalesceForceInt` (field1 int,field2 int,forceNull bool)
RETURNS int
BEGIN

	IF field1 is NULL THEN
		IF forceNull = true THEN
			RETURN NULL;
		ELSE
			RETURN field2;
		END IF;
    ELSE
		RETURN field1;
    END IF;
    
END;

SELECT getLevel(1)


DROP FUNCTION IF EXISTS getLevel;
DELIMITER $$;
CREATE FUNCTION getLevel(_id int) RETURNS varchar(10000) CHARSET utf8
BEGIN

	DECLARE _level int DEFAULT 0;
	DECLARE _higherUserId int DEFAULT 9999;
	DECLARE _it int DEFAULT 0;
	DECLARE _key varchar(10000) DEFAULT '';
    
	SELECT higherUserId
	INTO _higherUserId FROM
		person
	WHERE
		id = _id;
    
	SET _key = lpad(_id,4,'0');
    
	SET _key = CONCAT(lpad(_higherUserId,4,'0'),'-',_key);
    
	  WHILE _it < 50 && _higherUserId != 0 DO
		
        SELECT _higherUserId INTO _higherUserId
		FROM person
		WHERE _id = _higherUserId;
        
		SET _it = _it + 1;
		SET _level = _level + 1;
		SET _key = CONCAT(lpad(_higherUserId,4,'0'),'-',_key);
        
	  END WHILE;
      
	RETURN _key;
    
END;


    
