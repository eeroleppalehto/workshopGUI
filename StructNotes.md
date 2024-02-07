# Notes on data stucture collection

## stVisionData

```c
TYPE stVisionData :
STRUCT
	sVisionStatus				: STRING(50); 	(* Current Scanning state, 0 idle, started, stpped,  resumed, finished, scanning *)
	dtTimestamp					: DT;			(* time stamp from wc200, might differ from plc clock *)
	sOperatorId					: STRING(50);	(* Operator ID if name is given, not supported in all versions *)
	sStationId					: STRING(50);	(* Station ID if name is given, not supported in all versions *)
	nCurrentImageIndex			: INT;			(* if robots move in sync this might jump by number of robots when image taken *)
	nNumberOfImagesInScanArea	: INT;			(* Total number of images in marked area *)
	sStopSource					: STRING(50);	(* What stopped scan *)
	dtCurrentScanCycleStarted	: DT;			(* when current cycle started, uses plc clock which can be seen in machine data *)
END_STRUCT
END_TYPE
```

This structure contains eight fields:

1. sVisionStatus: A string of 50 characters that represents the current scanning state.
2. dtTimestamp: A datetime value that represents a timestamp from wc200.
3. sOperatorId: A string of 50 characters that represents the operator ID.
4. sStationId: A string of 50 characters that represents the station ID.
5. nCurrentImageIndex: An integer that represents the current image index.
6. nNumberOfImagesInScanArea: An integer that represents the total number of images in the marked area.

## stMachineData

```c
TYPE stMachineData :
STRUCT
	sMachineName					: STRING(50);
	sMachineTime					: DT;
	arrsFailureMessage				: ARRAY [0..10] OF STRING(255);
	arrsWarningMessage				: ARRAY	[0..10]	OF STRING(255);
	arrsInfoMessage					: ARRAY	[0..10]	OF STRING(255);
	nNumRunningRobots				: UINT;				(* Number of working robots *)
	arrfPortalEnergyConsumption		: ARRAY [0..23] OF REAL; (* portal energy consumption uses plc clock, stMachineData.sMachineData hours 0..23 *)
	arrfRobotEnergyConsumption		: ARRAY [0..23] OF REAL; (* Robot energy consumption uses plc clock, stMachineData.sMachineData hours 0..23 *)
	arrfWeldingEnergyConsumption	: ARRAY [0..23] OF REAL; (* Welding energy consumption uses plc clock, stMachineData.sMachineData hours 0..23 *)
END_STRUCT
END_TYPE
```

The stMachineData struct is defined as follows:

1. sMachineName: A string of 50 characters that represents the name of the machine.
2. sMachineTime: A datetime value that represents the machine time.
3. arrsFailureMessage: An array of strings, each of 255 characters. The array has 11 elements (from index 0 to 10), and each element represents a failure message.
4. arrsWarningMessage: An array of strings, each of 255 characters. The array has 11 elements (from index 0 to 10), and each element represents a warning message.
5. arrsInfoMessage: An array of strings, each of 255 characters. The array has 11 elements (from index 0 to 10), and each element represents an informational message.
6. nNumRunningRobots: An unsigned integer that represents the number of working robots.
7. arrfPortalEnergyConsumption: An array of real numbers with 24 elements (from index 0 to 23). Each element represents the portal energy consumption for a specific hour of the day.
8. arrfRobotEnergyConsumption: An array of real numbers with 24 elements (from index 0 to 23). Each element represents the robot energy consumption for a specific hour of the day.
9. arrfWeldingEnergyConsumption: An array of real numbers with 24 elements (from index 0 to 23). Each element represents the welding energy consumption for a specific hour of the day.

This structure is used to organize related data about a machine into a single unit.

## stTimeVariablesHourly

```c
TYPE stTimeVariablesHourly :
STRUCT
	arrtRobotRunningTime			: ARRAY [0..nNumberOfRobots,0..23] OF TIME; (* [robot,hour] Robot moving, robot 1..n(robots in station), Uses plc clock hours 0..23, array 0 is for any robot running*)
	arrtRobotWeldingTime			: ARRAY [0..nNumberOfRobots,0..23] OF TIME; (* [robot,hour] ARC on robot 1..n(robots in station), Uses plc clock hours 0..23, array 0 is for any robot running *)
	arrtPortalRunningTime			: ARRAY [0..23] OF TIME; (* portal is moving, Uses plc clock hours 0..23  *)
	arrtScanningTime				: ARRAY [0..23] OF TIME;	(* scanning active, Uses plc clock hours 0..23, calculated from vision state. If program closed mid scan this will keep increasing *rare case* *)
	arrtWaitingTime					: ARRAY [0..23] OF TIME; (* no job active, Uses plc clock hours 0..23  *)
END_STRUCT
END_TYPE
```

The data type is named stTimeVariablesHourly and it contains several arrays of TIME type. Each array represents a different type of time measurement for different activities in a robotic system. Here's a breakdown:

* arrtRobotRunningTime: A 2D array that records the running time of each robot for each hour of the day. The first dimension represents the robot number (from 1 to nNumberOfRobots), and the second dimension represents the hour of the day (from 0 to 23). The comment indicates that the 0 index in the first dimension is used for recording the running time of any robot.
* arrtRobotWeldingTime: Similar to arrtRobotRunningTime, but this array records the welding time instead of the running time.
* arrtPortalRunningTime: A 1D array that records the running time of a portal for each hour of the day.
* arrtScanningTime: A 1D array that records the scanning time for each hour of the day. The comment indicates that the scanning time is calculated from the vision state and will keep increasing if the program is closed mid-scan.
* arrtWaitingTime: A 1D array that records the waiting time (when no job is active) for each hour of the day.

## stPanelData

```c
TYPE stPanelData :
STRUCT
	sWorkpieceName					: STRING[50];		(* Panel ID from wc200 *)
	stPanelWelds					: stWelds;			(* number of welds done on panel *)
	stPanelWeldLength				: stWeldLength;		(* welded lenght on panel *)
	arrstRobotWelds					: ARRAY [1..nNumberOfRobots] OF stWelds;
	arrstRobotWeldLength				: ARRAY [1..nNumberOfRobots] OF stWeldLength;
	arrstCurrentJobList					: ARRAY [0..nJobListsKeptInMemory] OF stJobList;		(* array 0 = current job que, welds/finsihed welds,seq id, progress, 1 previous... *)
	dtPanelStartTime					: DT;				(* first message from wc200 (operator can send this by pressing "sendpanel start time" or when first weld finishes message is sent automaticly *)
	dtUpdatingPanelEndTime			: DT;				(* timestamp from latest update on panel, uses PLC clock this can differ from operator pc clock. PLC clock can be checked from machinedata *)
	dtPanelEndTime					: DT;				(* End time of panel, has value only when operator presses "send panel end time"*)
	nPanelStatus						: USINT;			(* Indicates state of panel [%](0-100), calculated from EVERY possible weld on panel / finished welds (lenght), propably wont reach 100% *)
	nRobotIndex						: USINT;			(* Robot number, that generated message. 0 if message was not created by robot *)

END_STRUCT
END_TYPE
```

The data type is named `stPanelData` and it contains several fields that represent different aspects of a panel in a robotic system. Here's a breakdown:

* `sWorkpieceName`: A string that stores the panel ID from wc200.

* `stPanelWelds`: A structure that records the number of welds done on the panel.

* `stPanelWeldLength`: A structure that records the welded length on the panel.

* `arrstRobotWelds`: An array that records the number of welds done by each robot. The array index represents the robot number (from 1 to `nNumberOfRobots`).

* `arrstRobotWeldLength`: An array that records the welded length by each robot. The array index represents the robot number (from 1 to `nNumberOfRobots`).

* `arrstCurrentJobList`: An array that stores the current job queue and other job-related information. The array index 0 represents the current job queue, and the other indices represent previous jobs.

* `dtPanelStartTime`: A datetime value that records the start time of the panel. This is set when the operator presses "sendpanel start time" or when the first weld finishes.

* `dtUpdatingPanelEndTime`: A datetime value that records the timestamp of the latest update on the panel. This uses the PLC clock, which can differ from the operator PC clock.

* `dtPanelEndTime`: A datetime value that records the end time of the panel. This is set when the operator presses "send panel end time".

* `nPanelStatus`: A USINT (Unsigned Short INTeger) that indicates the state of the panel as a percentage (0-100). This is calculated from every possible weld on the panel divided by the finished welds (length).

* `nRobotIndex`: A USINT that stores the robot number that generated the message. If the message was not created by a robot, this value is 0.

## stDataColRobotData

```c
TYPE stDataColRobotData :
STRUCT
	bRunning					: BOOL; 	(* Robot program running *)
	bWeldOn					: BOOL;		(* Robot is welding *)
	bError						: BOOL;
	bIdle						: BOOL;


	arrstRobotWeldsDaily		: ARRAY [0..nNumberOfDaysKeptInMemory] OF stWelds; 		(* Current day always array [0] Welds daily, uses plc clock which can be checked from machinedata*)
	arrstRobotWeldLengthDaily	: ARRAY [0..nNumberOfDaysKeptInMemory] OF stWeldLength; (* Current day always array [0] Welds daily, uses plc clock which can be checked from machinedata*)
END_STRUCT
END_TYPE
```

The data type is named stDataColRobotData and it contains several fields that represent different aspects of a robot's operation in a system. Here's a breakdown:

* bRunning: A boolean that indicates whether the robot program is running.
* bWeldOn: A boolean that indicates whether the robot is currently welding.
* bError: A boolean that indicates whether there is an error in the robot's operation.
* bIdle: A boolean that indicates whether the robot is idle.
* arrstRobotWeldsDaily: An array that records the number of welds done by the robot each day. The array index represents the day (from 0 to nNumberOfDaysKeptInMemory), with 0 always representing the current day. The comment indicates that the PLC clock is used, which can be checked from machine data.
* arrstRobotWeldLengthDaily: An array that records the welded length by the robot each day. The array index represents the day (from 0 to nNumberOfDaysKeptInMemory), with 0 always representing the current day. The comment indicates that the PLC clock is used, which can be checked from machine data.

## stTimeVariablesDaily

```c
TYPE stTimeVariablesDaily :
STRUCT
	arrtRobotDailyRunningTime		: ARRAY [0..nNumberOfRobots] OF TIME; (* Robot moving, robot 1..n(robots in station), array 0 is for any robot running *)
	arrtRobotDailyWeldingTime		: ARRAY [0..nNumberOfRobots] OF TIME; (* ARC on robot 1..n(robots in station) array 0 is for any robot running*)
	tPortalRunningTime				: TIME; (* portal is moving *)
	tScanningTime					: TIME;	(* scanning active, calculated from vision state. If program closed mid scan this will keep increasing *rare case* *)
	tWaitingTime					: TIME; (* no job active *)
END_STRUCT
END_TYPE
```

The data type is named stTimeVariablesDaily and it contains several fields that represent different time measurements for various activities in a robotic system. Here's a breakdown:

* arrtRobotDailyRunningTime: An array that records the daily running time of each robot. The array index represents the robot number (from 1 to nNumberOfRobots), with 0 representing the running time of any robot.
* arrtRobotDailyWeldingTime: An array that records the daily welding time of each robot. The array index represents the robot number (from 1 to nNumberOfRobots), with 0 representing the welding time of any robot.
* tPortalRunningTime: A TIME variable that records the daily running time of a portal.
* tScanningTime: A TIME variable that records the daily scanning time. The comment indicates that the scanning time is calculated from the vision state and will keep increasing if the program is closed mid-scan.
* tWaitingTime: A TIME variable that records the daily waiting time when no job is active.

## stJoblist

```c
TYPE stJoblist :
STRUCT
	dtStartTime					: DT;					(* timestamp when joblist was started, uses PLC clock this can differ from operator pc clock. PLC clock can be checked from machinedata *)
	nJobListNumber				: UINT;					(* 0 = first joblist on panel, increases when stCurrentJoblist.seqID changes but panel name stays same *)
	sJobListSeqId				: STRING(40);			(* Seq id is different string generated by WC200 program for each joblist, nJobListNumber can also be used *)
	stTotalWelds				: stWelds;				(* Number of welds in joblist *)
	stCompletedWelds			: stWelds;				(* finished welds in joblist *)
	stTotalWeldLength			: stWeldLength;			(* Lenght of planned welds in joblist *)
	stCompletedWeldLenght		: stWeldLength;			(* Completed WeldLenght in joblist *)
END_STRUCT
END_TYPE
```

The data type is named stJoblist and it contains several fields that represent different aspects of a job list in a robotic system. Here's a breakdown:

* dtStartTime: A datetime value that records the start time of the job list. This uses the PLC clock, which can differ from the operator PC clock. The PLC clock can be checked from machine data.
* nJobListNumber: A UINT (Unsigned INTeger) that indicates the job list number on a panel. 0 represents the first job list on a panel, and this number increases when stCurrentJoblist.seqID changes but the panel name stays the same.
* sJobListSeqId: A string that stores a unique identifier generated by the WC200 program for each job list. nJobListNumber can also be used to identify job lists.
* stTotalWelds: A structure that records the total number of welds in the job list.
* stCompletedWelds: A structure that records the number of finished welds in the job list.
* stTotalWeldLength: A structure that records the total length of planned welds in the job list.
* stCompletedWeldLenght: A structure that records the length of completed welds in the job list.

## stPersistOpcUa

```c
TYPE stPersistOpcUa :
STRUCT
	arrstPanelData					: ARRAY [0..nNumberOfPanelsInMemory] OF stPanelData;
	arrstRobotData					: ARRAY [1..nNumberOfRobots] OF stDataColRobotData; (* maybe move to non persistent memory and save needed variables in different persistant variables *)
	arrstTimeVariablesDaily			: ARRAY [0..nNumberOfDaysKeptInMemory] OF stTimeVariablesDaily; (* current day array = 0, previous day [1] *)
END_STRUCT
END_TYPE
```

The data type is named stPersistOpcUa and it contains several arrays of other data types. Here's a breakdown:

* arrstPanelData: An array that stores panel data. The array index represents the panel number (from 0 to nNumberOfPanelsInMemory).
* arrstRobotData: An array that stores robot data. The array index represents the robot number (from 1 to nNumberOfRobots).
* arrstTimeVariablesDaily: An array that stores daily time variables. The array index represents the day (from 0 to nNumberOfDaysKeptInMemory), with 0 representing the current day.

The stPersistOpcUa data type is used to organize and persistently store various data related to panels, robots, and daily time variables in a robotic system.

## stOpcUA

```c
TYPE stOpcUA :
STRUCT
	stVisionData 			: stVisionData;
	stMachineData			: stMachineData; 
	stTimeVariablesHourly	: stTimeVariablesHourly;
END_STRUCT
END_TYPE
```

The data type is named stOpcUA and it contains three fields, each of which is a structure of a different data type. Here's a breakdown:

* stVisionData: A structure of type stVisionData.
* stMachineData: A structure of type stMachineData.
* stTimeVariablesHourly: A structure of type stTimeVariablesHourly.

The stOpcUA data type is used to organize and store various data related to vision, machine, and hourly time variables in a robotic system.
