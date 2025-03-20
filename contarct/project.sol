// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HabitTracker {
    struct Habit {
        string name;
        uint256 streak;
        uint256 lastCompleted;
        bool active;
    }
    
    mapping(address => Habit[]) public userHabits;
    
    event HabitCreated(address indexed user, string name);
    event HabitCompleted(address indexed user, string name, uint256 streak);
    event HabitReset(address indexed user, string name);
    
    function createHabit(string memory _name) external {
        userHabits[msg.sender].push(Habit({
            name: _name,
            streak: 0,
            lastCompleted: 0,
            active: true
        }));
        emit HabitCreated(msg.sender, _name);
    }
    
    function completeHabit(uint256 _index) external {
        require(_index < userHabits[msg.sender].length, "Invalid habit index");
        Habit storage habit = userHabits[msg.sender][_index];
        require(habit.active, "Habit is inactive");
        require(block.timestamp > habit.lastCompleted + 1 days, "Can only complete once a day");
        
        habit.streak++;
        habit.lastCompleted = block.timestamp;
        
        emit HabitCompleted(msg.sender, habit.name, habit.streak);
    }
    
    function resetHabit(uint256 _index) external {
        require(_index < userHabits[msg.sender].length, "Invalid habit index");
        Habit storage habit = userHabits[msg.sender][_index];
        require(habit.active, "Habit is inactive");
        
        habit.streak = 0;
        emit HabitReset(msg.sender, habit.name);
    }
    
    function getUserHabits(address _user) external view returns (Habit[] memory) {
        return userHabits[_user];
    }
}
