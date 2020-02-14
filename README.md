# sig_xicon
Make sure that you have set up your computer with the right aws credentials that allow syou to run aws batch jobs
First ssh as ubuntu to compute.clue.io
cd to /cmap/M2 and do an aws s3 sync s3://macchiato.clue.io/builds/M2/foo/ ./foo/ (sync only the directory that you need)
clone this repository and cd into it and run node as follows:
 node sig_xicons.js NAME_OF_PATHWAY_FILE > results.txt (NAME_OF_PATHWAY_FILE could be same_pathway_pairs.txt)
 Examine the results.txt file, if it contains cell line names then it means that AWS failed to run those cell lines.
Rerun the script by feeding it the results.txt file as follows

node sig_xicons.js NAME_OF_PATHWAY_FILE results.txt > results1.txt (redirect the results into a different file. Repeat this process if the redirected file still contains some file names)

