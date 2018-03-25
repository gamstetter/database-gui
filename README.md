# database-gui

## Description

CS4092 project aimed at creating a user interface for the Reporting_developer database. This project will use html to input parameters for stored procedures, aided by nodejs. Our goal is to perform stored procedures through the database gui project.

## Team Members

Seth Diehm, Grace Gamstetter, Matthew Krauskopf, Christopher Ochs, Kyle O'Conner, Philip Tallo



Steps to set up running code:
1. create a user in ssms
    - user : root
    - password : rootPassword
2. Grant this user all permissions in the database by rick clicking Reporting_developer -> properties -> permissions -> view server permissions
3. Make sure that the following services in services are running
    a. SQL Server (MSSQLSERVER)
    b. SQL Server Agent (MSSQLSERVER)
    c. SQL Server Browser
    d. SQL SERVER CEIP Service (MSSQLSERVER)
    e. SQL Server VSS Writer