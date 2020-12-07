# tx81z
max patches for controlling a yamaha tx81z synthesizer

the main patch is tx81z-editor.maxpat. it contains the basic functionality to do two things:
* trigger the tx81z to dump the parameters of the currently-loaded patch, and parse and display that data
* control individual params of the tx81z

this is, therefore, just the main guts by which max will communicate with the tx81z. the next part of this project (in progress) is to create user controls that allow a person to manipulate the tx81z using 2020 techniques and data sources
