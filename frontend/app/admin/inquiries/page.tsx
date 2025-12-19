"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchInquiries } from "@/lib/redux/features/inquirySlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";
import { format } from "date-fns";

export default function InquiriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { inquiries, status } = useSelector(
    (state: RootState) => state.inquiries
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchInquiries());
    }
  }, [dispatch, token]);

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Customer Inquiries
        </h1>
        <p className="text-muted-foreground">
          View and manage all inquiries from potential clients.
        </p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {inquiry.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {inquiry.property.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inquiry.property.location}
                      </div>
                    </TableCell>
                    <TableCell>{inquiry.agent.name}</TableCell>
                    <TableCell>
                      {format(new Date(inquiry.createdAt), "dd MMM, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inquiry.status === "New" ? "default" : "secondary"
                        }
                      >
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Inquiry from {inquiry.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <p>
                              <strong>Customer:</strong> {inquiry.name}
                            </p>
                            <p>
                              <strong>Email:</strong> {inquiry.email}
                            </p>
                            <p>
                              <strong>Phone:</strong> {inquiry.phone}
                            </p>
                            <hr />
                            <p>
                              <strong>Message:</strong>
                            </p>
                            <p className="text-muted-foreground">
                              {inquiry.message}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
